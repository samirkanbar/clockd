# Clockd

100% vibe-coded remote work time tracker. Clock in/out, view weekly history, and export Excel timesheets.

## Deploy to Netlify

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project** → select your repo
3. Netlify auto-detects Vite: build command `npm run build`, publish dir `dist`
4. After the first deploy, go to **Site settings → Identity → Enable Identity**
5. Under Identity settings, enable **Email/Password** sign-up
6. Visit your live URL, sign up, and start tracking

## Local Development

```bash
npm install
npm run dev
```

> Note: Netlify Identity requires a deployed Netlify site to authenticate. Local dev will show the login screen but auth won't work until deployed.
