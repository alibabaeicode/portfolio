# Setting up the CMS (one-time)

The site now has a content editor at `/admin` (built on
[Sveltia CMS](https://github.com/sveltia/sveltia-cms)), pointed at
`content/paintings.json`, `content/home.json`, `content/about.json`, and
`content/contact.json`. Every edit made there is committed straight to this
repo's `main` branch, which the existing GitHub Actions workflow then
deploys — same pipeline as any other change to the site.

It's wired up in code already, but **won't let anyone log in yet** — GitHub
doesn't allow a static site to authenticate users on its own, so a small
piece of one-time setup is needed first. None of this touches the site
itself; it's all account configuration outside this repo. It has to be done
by you (Ali), since it needs access to your GitHub and Cloudflare accounts
that I don't have.

## 1. Deploy the OAuth proxy (Cloudflare Worker)

This is a small relay that GitHub's login flow talks to. Sveltia's project
ships a ready-made one — no code to write.

1. Go to https://github.com/sveltia/sveltia-cms-auth and fork it (or just
   copy `index.js`'s contents — it's one file).
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers
   & Pages** → **Create** → **Create Worker**. Paste in the code, or connect
   it to your fork of the repo above so it deploys from GitHub directly.
3. Deploy it. Note the URL it gives you, e.g.
   `https://sveltia-cms-auth.<your-subdomain>.workers.dev`.

## 2. Create a GitHub OAuth App

1. GitHub → your avatar → **Settings** → **Developer settings** →
   **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name**: anything, e.g. "Ali Babaei Portfolio CMS"
   - **Homepage URL**: `https://alibabaei.art`
   - **Authorization callback URL**: `<your Worker URL from step 1>/callback`
3. Register it, then generate a **Client Secret**. Keep both the **Client
   ID** and **Client Secret** — you'll need them next.

## 3. Give the Worker your OAuth App's credentials

Back in the Cloudflare dashboard, open the Worker from step 1 → **Settings**
→ **Variables** → add:

- `GITHUB_CLIENT_ID` — from step 2
- `GITHUB_CLIENT_SECRET` — from step 2
- `ALLOWED_DOMAINS` — `alibabaei.art` (so only this site can use the proxy)

## 4. Point the CMS at the Worker

Open `admin/config.yml` in this repo and replace the placeholder:

```yaml
backend:
  base_url: https://REPLACE-ME.workers.dev
```

with your actual Worker URL from step 1. Commit and push (or just tell me
the URL and I'll do it).

## 5. Log in

Visit `https://alibabaei.art/admin/` and click **Login with GitHub**. You
should land in the editor with four collections: Paintings, Home Page,
About Page, Contact Page. Anyone who can push to this repo can log in this
way — there's no separate CMS user list to manage.

## What editing there actually does

- **Paintings**: add, remove, reorder, or retitle any painting; upload a
  replacement image right there (goes into `assets/paintings/`).
- **Home Page**: tagline, the hero/feature image picks, the small heading +
  line next to the second hero image, the statement line, and the closing
  line.
- **Contact Page**: the note above the email, and the email address itself.
- **About Page**: the paragraphs, one per list item.

Every save is a real commit to `main` — GitHub Actions redeploys the site
within a minute or two, same as any other change.
