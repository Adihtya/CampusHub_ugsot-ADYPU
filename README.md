# UGSOTADYPU Hub

A campus hub for events, student profiles and community posts. Built with Next.js 14 (App Router), React and TypeScript, with plain CSS.

## Run it

You need Node.js 18.17 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

To make a production build: `npm run build`. The static site is written to `out/`.

## Deploy to GitHub Pages

The site deploys to GitHub Pages using the workflow in `.github/workflows/deploy.yml`.
In the repository's **Settings → Pages**, set **Build and deployment → Source** to
**GitHub Actions**. The workflow runs automatically when changes are pushed to `main`.
The deployed site is https://adihtya.github.io/CampusHub_ugsot-ADYPU/.

## What's where

```
app/
  layout.tsx            Header, fonts and the floating profile button on every page
  globals.css           All styles. Colours, radii and shadows are tokens at the top
  page.tsx              Home: calendar, daily highlights, teammate card, latest posts
  events/page.tsx       Events: filters, list view and calendar view
  students/page.tsx     Student directory with search and skill filters
  students/[id]/page.tsx  A student's public profile
  profile/page.tsx      Your own profile (shows completeness and Edit)
  community/page.tsx    Posts with tags, upvotes and a composer
components/             Reusable pieces (Calendar, ProfileView, CommunityFeed, ...)
lib/
  types.ts              Data shapes for events, students, highlights and posts
  data.ts               Sample data. Replace with real database queries
  colors.ts             Colours per event type and post tag
  dates.ts              Date helpers. "Today" uses the Asia/Kolkata timezone
```

## Next steps

1. **Real data.** Everything reads from `lib/data.ts`. Swap those arrays for queries to Supabase or Firebase; the types in `lib/types.ts` are a good starting schema.
2. **Sign-in.** `CURRENT_USER_ID` in `lib/data.ts` stands in for the logged-in student. Replace it with your auth session, and restrict sign-up to your college email domain.
3. **Saving.** New community posts and upvotes live only in the browser for now. Wire `submit` and the vote button in `components/CommunityFeed.tsx` to your backend.
4. **Submit an event.** The button is in place on Home and Events; it needs a form and an approval step.
