---
name: Blog admin & content workflow
description: How to manage Synaplan blog content. Optimised against the
  failure mode of "agent reaches for clever automation when a two-click
  UI workflow exists".
---

# Blog admin & content workflow

This file is the operating manual for anyone (human or agent) touching
the Synaplan blog / `/admin` CMS. It is short on purpose. Re-read it
when you start touching any file under:

- `src/app/admin/**`
- `src/components/admin/**`
- `src/app/api/admin/**`
- `src/app/[locale]/blog/**`

## 1. Content lives behind the admin UI — use it

The blog is a CMS, not a flat-file site. **Editing content means logging
into the live admin and clicking things.** The login is in
`graphic_ideas_material/zugang.txt` (URL + email + password).

- Open a Cursor browser tab, navigate to `/admin/login`, sign in.
- For new posts: `/admin/posts/new`.
- For edits: `/admin/posts/{id}/edit`.
- Both locales of a post are tabs inside the same editor (🇩🇪 / 🇬🇧).

If you find yourself writing curl scripts, reading prod DB rows from
your laptop, or "just calling the upload API directly", stop. You are
re-implementing the admin UI badly. There is already a working UI two
clicks away.

## 2. Specific anti-patterns we have actually hit

The following have all happened in real sessions. Don't repeat them.

| Don't | Do |
|---|---|
| Chunk base64 through `Runtime.evaluate` to upload a screenshot | Click the editor's **Image** / **Upload cover** button |
| Build multipart `FormData` in CDP from a `Blob` you assembled in JS | Same — the button does this for you, using the admin cookie |
| Try to set a hidden `<input type="file">` via `DOM.setFileInputFiles` | Same |
| `psql` / `prisma studio` against the prod DB to backdate a row | Use the **Published** date input in the editor and Update |
| `scp` / `ssh` a one-off fix to prod | Push to `main`; the watchguard polls GHCR and redeploys |
| Rename a slug to "fix" a 404 from the language switcher | Publish a bridge / stub post at the missing slug (see §5) |

The pattern: every clever bypass we tried got blocked, refused, or
silently broke something. Every time the **answer was a button on the
admin page**, used in the browser tab where we were already logged in.

## 3. The two locales of a post

A "logical post" is two `Post` rows in Postgres, one per `locale`,
joined by `translationKey`. The editor presents both as language tabs.

- Both locales **must** share the same `slug` for the language switcher
  to resolve cleanly (`src/components/layout/language-switcher.tsx` is
  deliberately dumb: it only swaps the locale prefix on the current
  path).
- `translationKey` (the "Translation key" field, default = `slugify(title)`)
  is what makes the two rows show up as tabs in the editor and what the
  hreflang generator uses.
- The status of each locale is independent. Either can be `DRAFT`.

## 4. Dates: the editor is right, the server is law

`publishedAt` is **never** invented by the client.

- POST creates: server stamps `now()` when the new post is created as
  PUBLISHED (unless an explicit ISO date is sent).
- PUT edits: explicit ISO date from the **Published** date input wins;
  else `now()` only on the first DRAFT→PUBLISHED transition;
  else the existing `publishedAt` is preserved.

So: **a typo-fix on a 6-month-old article does not re-date it.** That
guard is at `src/app/api/admin/posts/[id]/route.ts`; do not regress it.

## 5. Bridge / stub posts (fixing 404s from the switcher)

If an older post-pair ended up with different per-locale slugs (and
both URLs already rank on Google), do **not** rename either slug.
Instead publish a "bridge" stub for each missing slug+locale combo:

- Same `translationKey` as its sibling bridge (a *new* key — not the
  original article's key).
- A short body containing a prominent link to the canonical article
  in the matching language plus a backref to the other language.
- `publishedAt` set to the original article's publish date (via the
  Published input), so the bridge slots in next to the original and
  does not dominate `/news`.

Bridges live forever; do not delete them.

## 6. Deployment is the only path

```
git push origin main
  → GitHub Actions CI
    → push ghcr.io/metadist/synaplan-website:latest
      → prod watchguard pulls and redeploys
```

That is the entire deploy pipeline. There is **no** SSH, **no** `scp`,
**no** direct DB access. The prod Postgres binds to `db:5432` inside
the docker network and is unreachable from any developer machine.

`docker-compose.prod.yml` changes are the *only* thing the watchguard
does not sync — coordinate those separately when needed.

## 7. Before adding a new column

Before reaching for a Prisma migration, JSON blob, or a "just-one-more
boolean" on `Post`, check whether the existing surface already covers
it:

1. `Post` in `prisma/schema.prisma`
2. The editor in `src/components/admin/post-editor.tsx`
3. `status` (DRAFT / PUBLISHED / ARCHIVED), `publishedAt`, `tags`,
   `translationKey`

Most "hide this from the listing" / "schedule this" / "mark this as
canonical" needs can be done with what is already there.

## 8. When in doubt

> If the simplest path is "log into the admin in a browser and click
> two buttons", do that. If you are about to spend more than 15 minutes
> wiring an upload pipeline, **a button on the page already does it**.
