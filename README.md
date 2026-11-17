# UGSOTADYPU Hub

A campus hub for events, student profiles and community posts. Built with Next.js 16 (App Router), React and TypeScript, with plain CSS.

## Run it

You need Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

Other checks:

```bash
npm run lint
npm run type-check
npm run build
```

To run a production build locally, use `npm run build`, then `npm start`.

## What's where

```
app/
  layout.tsx            Fonts, desktop/mobile navigation and the floating profile button
  globals.css           Bold pop design tokens, base styles and responsive navigation
  components.css        Shared page and component styles
  page.tsx              Home: calendar, daily highlights, teammate card, latest posts
  events/page.tsx       Events: filters, list view and calendar view
  students/page.tsx     Student directory with search and skill filters
  students/[id]/page.tsx  A student's public profile
  profile/page.tsx      Your own profile (shows completeness and Edit)
  community/page.tsx    Posts with tags, upvotes and a composer
components/              Reusable page components and shared navigation
  ui/                    Button, Card, Tag and labeled Input
lib/
  types.ts              Data shapes for events, hackathons, students and posts
  data.ts               Sample event and campus data
  db/events.ts          Async Supabase event data access boundary
  db/database.types.ts  Database types for the event data layer
  supabase/server.ts    Cookie-aware server Supabase client
  colors.ts             Shared design-token colors for tags and event categories
  dates.ts              Date helpers. "Today" uses the Asia/Kolkata timezone
supabase/migrations/    Database tables, roles, triggers and row-level security
.env.example             Placeholders for Supabase
```

## Supabase setup

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` from your Supabase project's Connect dialog. The publishable key is intended for client access; never put a secret/service-role key in this app.
2. Apply the migrations in filename order. The base event/auth schema is `supabase/migrations/20261117000000_events_data_layer.sql`; `supabase/migrations/20261117150000_event_registration.sql` adds the trusted event capacity catalog and atomic registration/cancellation functions; `supabase/migrations/20261117160000_hackathon_teams_announcements.sql` adds hackathon metadata and database-enforced team limits. If earlier migrations have already run, apply only the migrations that are still pending.
3. Promote organizer accounts from the Supabase SQL editor after they have registered:

   ```sql
   update public.profiles
   set role = 'organizer'
   where email = 'organizer@example.com';
   ```

   Profile role changes are not granted to normal signed-in users.
4. Configure Supabase Auth's site URL and allowed redirect URLs for localhost and the deployed application. If email confirmation is enabled, new accounts must confirm before signing in. CampusHub accepts syntactically valid email addresses from any domain; it does not enforce a college-only domain.

The event activity boundary is `lib/db/events.ts`; its async operations use the user's Supabase session and database row-level security. Registration capacity and deadlines are checked inside a database transaction, and authenticated clients cannot directly insert or delete registration rows. Hackathon team membership is serialized and constrained by database-side team limits and per-event email uniqueness. Announcement reads are public; posting still requires an organizer role in both the API and RLS. The current events calendar still reads dates and presentation details from `lib/data.ts`; migrations seed the trusted capacity, registration, and team-size metadata without adding event editing.

Without Supabase environment variables, public pages remain viewable, while sign-in and registration return a clear configuration message. Existing demo-auth cookies are no longer treated as signed-in sessions.

Community posts and upvotes still live only in the browser for now. Wire `submit` and the vote button in `components/CommunityFeed.tsx` to a backend separately.
