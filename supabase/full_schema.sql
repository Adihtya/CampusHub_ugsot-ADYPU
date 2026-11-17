create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  course_year text,
  role text not null default 'student' check (role in ('student', 'organizer')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, course_year)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'course_year'
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      course_year = excluded.course_year,
      updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

create or replace function public.is_event_organizer()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'organizer'
  );
$$;

revoke all on function public.is_event_organizer() from public;
grant execute on function public.is_event_organizer() to authenticated;

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create table public.event_announcements (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  author_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  message text not null check (length(trim(message)) > 0),
  created_at timestamptz not null default now()
);

create table public.event_teams (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  name text not null check (length(trim(name)) > 0),
  leader_id uuid not null references auth.users (id) on delete cascade,
  leader_email text not null,
  created_at timestamptz not null default now()
);

create table public.event_team_members (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  team_id uuid not null references public.event_teams (id) on delete cascade,
  member_email text not null,
  email_key text generated always as (lower(trim(member_email))) stored,
  created_at timestamptz not null default now(),
  unique (event_id, email_key)
);

create or replace function public.is_event_team_member(target_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.event_team_members
    where team_id = target_team_id
      and email_key = lower(trim((select auth.jwt() ->> 'email')))
  );
$$;

create or replace function public.is_event_team_leader(target_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.event_teams
    where id = target_team_id
      and leader_id = (select auth.uid())
  );
$$;

revoke all on function public.is_event_team_member(uuid) from public;
revoke all on function public.is_event_team_leader(uuid) from public;
grant execute on function public.is_event_team_member(uuid) to authenticated;
grant execute on function public.is_event_team_leader(uuid) to authenticated;

create or replace function public.ensure_team_leader_membership()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and (
    old.event_id <> new.event_id or old.leader_email <> new.leader_email
  ) then
    delete from public.event_team_members
    where team_id = old.id
      and event_id = old.event_id
      and email_key = lower(trim(old.leader_email));
  end if;

  insert into public.event_team_members (event_id, team_id, member_email)
  values (new.event_id, new.id, lower(trim(new.leader_email)))
  on conflict (event_id, email_key) do nothing;

  if not exists (
    select 1
    from public.event_team_members
    where team_id = new.id
      and event_id = new.event_id
      and email_key = lower(trim(new.leader_email))
  ) then
    raise exception 'A student can only belong to one team per hackathon.';
  end if;
  return new;
end;
$$;

create trigger keep_team_leader_in_members
  after insert or update of event_id, leader_email on public.event_teams
  for each row execute function public.ensure_team_leader_membership();

create table public.event_attendance (
  event_id text not null,
  user_id uuid not null,
  status text not null check (status in ('present', 'absent')),
  updated_at timestamptz not null default now(),
  primary key (event_id, user_id),
  foreign key (event_id, user_id)
    references public.event_registrations (event_id, user_id) on delete cascade
);

create table public.event_certificates (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  user_id uuid not null,
  issued_at timestamptz not null default now(),
  unique (event_id, user_id),
  foreign key (event_id, user_id)
    references public.event_registrations (event_id, user_id) on delete cascade
);

create or replace function public.require_present_attendance_for_certificate()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.event_attendance
    where event_id = new.event_id
      and user_id = new.user_id
      and status = 'present'
  ) then
    raise exception 'Certificates require present attendance.';
  end if;
  return new;
end;
$$;

create trigger certificate_requires_present_attendance
  before insert or update on public.event_certificates
  for each row execute function public.require_present_attendance_for_certificate();

revoke all on public.profiles,
  public.event_registrations,
  public.event_announcements,
  public.event_teams,
  public.event_team_members,
  public.event_attendance,
  public.event_certificates
from anon, authenticated;

alter table public.profiles enable row level security;
alter table public.event_registrations enable row level security;
alter table public.event_announcements enable row level security;
alter table public.event_teams enable row level security;
alter table public.event_team_members enable row level security;
alter table public.event_attendance enable row level security;
alter table public.event_certificates enable row level security;

create policy "Profiles are visible to their owner and organizers"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select public.is_event_organizer()));
create policy "Users can update their own profile details"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
grant select on public.profiles to authenticated;
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, course_year) on public.profiles to authenticated;

create policy "Users can read their registrations and organizers can read all"
  on public.event_registrations for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_event_organizer()));
create policy "Users can register themselves"
  on public.event_registrations for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "Users can cancel their own registrations"
  on public.event_registrations for delete to authenticated
  using (user_id = (select auth.uid()) or (select public.is_event_organizer()));
grant select, insert, delete on public.event_registrations to authenticated;

create policy "Event announcements are public"
  on public.event_announcements for select to anon, authenticated
  using (true);
create policy "Organizers can publish announcements"
  on public.event_announcements for insert to authenticated
  with check (author_id = (select auth.uid()) and (select public.is_event_organizer()));
create policy "Organizers can edit announcements"
  on public.event_announcements for update to authenticated
  using ((select public.is_event_organizer()))
  with check ((select public.is_event_organizer()));
create policy "Organizers can remove announcements"
  on public.event_announcements for delete to authenticated
  using ((select public.is_event_organizer()));
grant select on public.event_announcements to anon, authenticated;
grant insert, update, delete on public.event_announcements to authenticated;

create policy "Teams are visible to members and organizers"
  on public.event_teams for select to authenticated
  using (
    leader_id = (select auth.uid())
    or (select public.is_event_organizer())
    or (select public.is_event_team_member(id))
  );
create policy "Authenticated users can create teams as their leader"
  on public.event_teams for insert to authenticated
  with check (
    leader_id = (select auth.uid())
    and lower(trim(leader_email)) = lower(trim((select auth.jwt() ->> 'email')))
  );
create policy "Team leaders and organizers can update teams"
  on public.event_teams for update to authenticated
  using (leader_id = (select auth.uid()) or (select public.is_event_organizer()))
  with check (
    (
      leader_id = (select auth.uid())
      and lower(trim(leader_email)) = lower(trim((select auth.jwt() ->> 'email')))
    )
    or (select public.is_event_organizer())
  );
create policy "Team leaders and organizers can delete teams"
  on public.event_teams for delete to authenticated
  using (leader_id = (select auth.uid()) or (select public.is_event_organizer()));
grant select, insert, update, delete on public.event_teams to authenticated;

create policy "Team members and organizers can read team invitations"
  on public.event_team_members for select to authenticated
  using (
    email_key = lower(trim((select auth.jwt() ->> 'email')))
    or (select public.is_event_organizer())
    or (select public.is_event_team_member(team_id))
    or (select public.is_event_team_leader(team_id))
  );
create policy "Team leaders can invite members"
  on public.event_team_members for insert to authenticated
  with check (
    exists (
      select 1 from public.event_teams teams
      where teams.id = team_id
        and teams.event_id = event_id
        and (
          teams.leader_id = (select auth.uid())
          or (select public.is_event_organizer())
        )
    )
  );
create policy "Team leaders and members can remove membership"
  on public.event_team_members for delete to authenticated
  using (
    email_key = lower(trim((select auth.jwt() ->> 'email')))
    or (select public.is_event_organizer())
    or (select public.is_event_team_leader(team_id))
  );
grant select, insert, delete on public.event_team_members to authenticated;

create policy "Users can read their attendance and organizers can read all"
  on public.event_attendance for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_event_organizer()));
create policy "Organizers manage attendance"
  on public.event_attendance for insert to authenticated
  with check ((select public.is_event_organizer()));
create policy "Organizers update attendance"
  on public.event_attendance for update to authenticated
  using ((select public.is_event_organizer()))
  with check ((select public.is_event_organizer()));
create policy "Organizers remove attendance"
  on public.event_attendance for delete to authenticated
  using ((select public.is_event_organizer()));
grant select, insert, update, delete on public.event_attendance to authenticated;

create policy "Users can read their certificates and organizers can read all"
  on public.event_certificates for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_event_organizer()));
create policy "Organizers issue certificates"
  on public.event_certificates for insert to authenticated
  with check ((select public.is_event_organizer()));
create policy "Organizers revoke certificates"
  on public.event_certificates for delete to authenticated
  using ((select public.is_event_organizer()));
grant select, insert, delete on public.event_certificates to authenticated;
create table public.event_catalog (
  id text primary key,
  title text not null,
  capacity integer not null check (capacity > 0),
  registration_deadline date not null
);

insert into public.event_catalog (id, title, capacity, registration_deadline) values
  ('freshers-talk', 'Freshers’ tech talk', 120, '2026-10-16'),
  ('smart-campus-ideathon', 'Smart campus ideathon', 60, '2026-10-20'),
  ('git-workshop', 'Intro to Git & GitHub', 40, '2026-11-03'),
  ('oss-sprint', 'Open-source sprint', 60, '2026-11-06'),
  ('design-jam', 'UI/UX Design Jam', 30, '2026-11-09'),
  ('campus-hackathon', 'Campus Hackathon 2026', 100, '2026-11-10'),
  ('rapid-prototyping-workshop', 'Rapid Prototyping Workshop', 30, '2026-11-13'),
  ('student-maker-meetup', 'Student Maker Meetup', 50, '2026-11-13'),
  ('ml-circle', 'ML Paper Reading Circle', 25, '2026-11-17'),
  ('codefest', 'Inter-college Codefest', 200, '2026-11-15'),
  ('resume-clinic', 'Resume & LinkedIn clinic', 40, '2026-11-24'),
  ('global-ai-hackathon', 'Global AI Hackathon', 200, '2026-11-20')
on conflict (id) do update
set title = excluded.title,
    capacity = excluded.capacity,
    registration_deadline = excluded.registration_deadline;

alter table public.event_catalog enable row level security;
revoke all on public.event_catalog from anon, authenticated;
grant select on public.event_catalog to anon, authenticated;

create policy "Event catalog is public"
  on public.event_catalog for select to anon, authenticated
  using (true);

revoke insert, delete on public.event_registrations from authenticated;

create or replace function public.get_event_registration_statuses(p_event_ids text[])
returns table (
  event_id text,
  capacity integer,
  registration_deadline date,
  seats_left integer,
  is_registered boolean,
  registration_open boolean
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    catalog.id,
    catalog.capacity,
    catalog.registration_deadline,
    greatest(catalog.capacity - count(registration.user_id)::integer, 0),
    coalesce(bool_or(registration.user_id = (select auth.uid())), false),
    catalog.registration_deadline >= (now() at time zone 'Asia/Kolkata')::date
      and count(registration.user_id) < catalog.capacity
  from public.event_catalog as catalog
  left join public.event_registrations as registration
    on registration.event_id = catalog.id
  where catalog.id = any(p_event_ids)
  group by catalog.id;
$$;

create or replace function public.register_for_event(p_event_id text)
returns table (
  result text,
  seats_left integer,
  capacity integer,
  registration_deadline date
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  event_row public.event_catalog%rowtype;
  registration_count integer;
begin
  if current_user_id is null then
    raise exception 'Sign in to register.';
  end if;

  select * into event_row
  from public.event_catalog
  where id = p_event_id
  for update;

  if not found then
    raise exception 'This event is not available for registration.';
  end if;

  select count(*)::integer into registration_count
  from public.event_registrations
  where event_id = p_event_id;

  if exists (
    select 1
    from public.event_registrations
    where event_id = p_event_id and user_id = current_user_id
  ) then
    return query select
      'already_registered'::text,
      greatest(event_row.capacity - registration_count, 0),
      event_row.capacity,
      event_row.registration_deadline;
    return;
  end if;

  if event_row.registration_deadline < (now() at time zone 'Asia/Kolkata')::date then
    return query select
      'deadline_passed'::text,
      greatest(event_row.capacity - registration_count, 0),
      event_row.capacity,
      event_row.registration_deadline;
    return;
  end if;

  if registration_count >= event_row.capacity then
    return query select
      'full'::text,
      0,
      event_row.capacity,
      event_row.registration_deadline;
    return;
  end if;

  insert into public.event_registrations (event_id, user_id)
  values (p_event_id, current_user_id);

  return query select
    'registered'::text,
    greatest(event_row.capacity - registration_count - 1, 0),
    event_row.capacity,
    event_row.registration_deadline;
end;
$$;

create or replace function public.cancel_event_registration(p_event_id text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then
    raise exception 'Sign in to cancel a registration.';
  end if;

  delete from public.event_registrations
  where event_id = p_event_id and user_id = current_user_id;
  return found;
end;
$$;

revoke all on function public.get_event_registration_statuses(text[]) from public;
revoke all on function public.register_for_event(text) from public;
revoke all on function public.cancel_event_registration(text) from public;
grant execute on function public.get_event_registration_statuses(text[]) to anon, authenticated;
grant execute on function public.register_for_event(text) to authenticated;
grant execute on function public.cancel_event_registration(text) to authenticated;
alter table public.event_catalog
  add column event_type text not null default 'event'
    check (event_type in ('event', 'hackathon')),
  add column team_size_min integer,
  add column team_size_max integer,
  add column theme text,
  add column prize text,
  add column rules jsonb not null default '[]'::jsonb,
  add constraint event_catalog_team_size_check check (
    (event_type = 'event' and team_size_min is null and team_size_max is null)
    or (
      event_type = 'hackathon'
      and team_size_min >= 1
      and team_size_max >= team_size_min
      and theme is not null
      and prize is not null
      and jsonb_typeof(rules) = 'array'
    )
  );

update public.event_catalog
set event_type = 'hackathon',
    team_size_min = 1,
    team_size_max = 4,
    theme = 'To be announced',
    prize = 'To be announced',
    rules = '[]'::jsonb
where id in ('smart-campus-ideathon', 'campus-hackathon', 'global-ai-hackathon');

create unique index event_teams_one_leader_per_hackathon
  on public.event_teams (event_id, leader_id);

revoke update on public.event_teams from authenticated;
grant update (name) on public.event_teams to authenticated;

create or replace function public.validate_hackathon_announcement()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.event_catalog
    where id = new.event_id and event_type = 'hackathon'
  ) then
    raise exception 'Announcements are only available for hackathons.'
      using errcode = '23514';
  end if;

  if length(btrim(new.message)) > 1000 then
    raise exception 'Announcements must be 1000 characters or fewer.'
      using errcode = '22023';
  end if;

  return new;
end;
$$;

create trigger validate_hackathon_announcement
  before insert or update on public.event_announcements
  for each row execute function public.validate_hackathon_announcement();

create or replace function public.validate_hackathon_team()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_record public.event_catalog%rowtype;
  current_user_id uuid := (select auth.uid());
  current_email text := lower(btrim((select auth.jwt() ->> 'email')));
begin
  if current_user_id is null or current_email is null then
    raise exception 'Sign in to create a hackathon team.'
      using errcode = '28000';
  end if;

  if new.leader_id <> current_user_id or lower(btrim(new.leader_email)) <> current_email then
    raise exception 'The signed-in user must be the team leader.'
      using errcode = '42501';
  end if;

  if length(btrim(new.name)) not between 1 and 80 then
    raise exception 'Team names must be between 1 and 80 characters.'
      using errcode = '22023';
  end if;

  select * into event_record
  from public.event_catalog
  where id = new.event_id
  for update;

  if not found or event_record.event_type <> 'hackathon' then
    raise exception 'Teams are only available for listed hackathons.'
      using errcode = '23514';
  end if;

  if event_record.registration_deadline < (now() at time zone 'Asia/Kolkata')::date then
    raise exception 'Team registration for this hackathon has closed.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger validate_hackathon_team
  before insert on public.event_teams
  for each row execute function public.validate_hackathon_team();

create or replace function public.validate_hackathon_team_member()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  team_event_id text;
  team_capacity integer;
  current_member_count integer;
begin
  select teams.event_id, catalog.team_size_max
  into team_event_id, team_capacity
  from public.event_teams as teams
  join public.event_catalog as catalog on catalog.id = teams.event_id
  where teams.id = new.team_id and catalog.event_type = 'hackathon'
  for update of teams;

  if not found or new.event_id <> team_event_id then
    raise exception 'The team member does not match this hackathon.'
      using errcode = '23514';
  end if;

  new.member_email := lower(btrim(new.member_email));
  if new.member_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Enter a valid email address for each team member.'
      using errcode = '22023';
  end if;

  select count(*)::integer into current_member_count
  from public.event_team_members
  where team_id = new.team_id;

  if current_member_count + 1 > team_capacity then
    raise exception 'This team has reached the maximum size for this hackathon.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger validate_hackathon_team_member
  before insert on public.event_team_members
  for each row execute function public.validate_hackathon_team_member();

create or replace function public.enforce_hackathon_team_minimum()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  minimum_size integer;
  actual_size integer;
begin
  select catalog.team_size_min into minimum_size
  from public.event_teams as teams
  join public.event_catalog as catalog on catalog.id = teams.event_id
  where teams.id = new.id and catalog.event_type = 'hackathon';

  if not found then
    return null;
  end if;

  select count(*)::integer into actual_size
  from public.event_team_members
  where team_id = new.id;

  if actual_size < minimum_size then
    raise exception 'A team must have at least % members, including its leader.', minimum_size
      using errcode = '23514';
  end if;

  return null;
end;
$$;

create constraint trigger enforce_hackathon_team_minimum
  after insert on public.event_teams
  deferrable initially deferred
  for each row execute function public.enforce_hackathon_team_minimum();

revoke delete on public.event_team_members from authenticated;

create or replace function public.create_hackathon_team(
  p_event_id text,
  p_name text,
  p_member_emails text[]
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  leader_email text := lower(btrim((select auth.jwt() ->> 'email')));
  event_record public.event_catalog%rowtype;
  normalized_emails text[];
  team_size integer;
  created_team_id uuid;
begin
  if current_user_id is null or leader_email is null then
    raise exception 'Sign in to create a hackathon team.'
      using errcode = '28000';
  end if;

  if p_name is null or length(btrim(p_name)) not between 1 and 80 then
    raise exception 'Team names must be between 1 and 80 characters.'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(coalesce(p_member_emails, '{}'::text[])) as invite(email)
    where invite.email is null
      or btrim(invite.email) !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ) then
    raise exception 'Enter a valid email address for each team member.'
      using errcode = '22023';
  end if;

  select * into event_record
  from public.event_catalog
  where id = p_event_id;

  if not found or event_record.event_type <> 'hackathon' then
    raise exception 'Teams are only available for listed hackathons.'
      using errcode = '23514';
  end if;

  if event_record.registration_deadline < (now() at time zone 'Asia/Kolkata')::date then
    raise exception 'Team registration for this hackathon has closed.'
      using errcode = 'P0001';
  end if;

  if exists (
    select 1 from public.event_teams
    where event_id = p_event_id and leader_id = current_user_id
  ) or exists (
    select 1 from public.event_team_members
    where event_id = p_event_id and email_key = leader_email
  ) then
    raise exception 'You are already on a team for this hackathon.'
      using errcode = 'P0001';
  end if;

  select coalesce(array_agg(distinct lower(btrim(invite.email))), '{}'::text[])
  into normalized_emails
  from unnest(coalesce(p_member_emails, '{}'::text[])) as invite(email)
  where lower(btrim(invite.email)) <> leader_email;

  team_size := cardinality(normalized_emails) + 1;
  if team_size < event_record.team_size_min or team_size > event_record.team_size_max then
    raise exception 'Team size must be between % and % members, including the leader.',
      event_record.team_size_min, event_record.team_size_max
      using errcode = '22023';
  end if;

  insert into public.event_teams (event_id, name, leader_id, leader_email)
  values (p_event_id, btrim(p_name), current_user_id, leader_email)
  returning id into created_team_id;

  insert into public.event_team_members (event_id, team_id, member_email)
  select p_event_id, created_team_id, invite.email
  from unnest(normalized_emails) as invite(email);

  return created_team_id;
exception
  when unique_violation then
    raise exception 'One or more of these students are already on a team for this hackathon.'
      using errcode = '23505';
end;
$$;

revoke all on function public.create_hackathon_team(text, text, text[]) from public;
grant execute on function public.create_hackathon_team(text, text, text[]) to authenticated;
