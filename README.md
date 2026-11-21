# Aroha Music website

A complete, separate website project. The Android app folder is unchanged.

## Run locally

```sh
cd Aroha-Music-Website
python3 scripts/serve.py
```

Open http://127.0.0.1:4173. No npm dependencies or build step are required. `npm run dev` is an equivalent shortcut.

## Check

```sh
python3 scripts/check.py
node --check dist/app.js
node scripts/interaction_check.cjs
```

The site explains Aroha directly as a free, ad-free YouTube Music alternative for Android and includes a responsive homepage, a gallery of real Android screenshots with accessible enlargement, reduced-motion support, FAQ disclosures, mobile navigation, official APK download links, GitHub contribution/issue links, email contact, a privacy page and a substantive Android YouTube Music alternative page.

## Publish on your public domain

The `dist/` folder is the complete deployable website. It works on ordinary static hosting (Cloudflare Pages, Netlify, a static server). There is no server-side application or account setup to maintain. The supplied `_headers` file is recognized by compatible static hosts; configure equivalent response headers on other hosts. Missing routes should serve `404.html` with HTTP 404, not an SPA fallback.

Before changing hosts or attaching your own domain, update the origin:

```sh
python3 scripts/configure_origin.py https://your-domain.example
python3 scripts/check.py
```

This updates canonical links, Open Graph images, JSON-LD, sitemap and robots, including the JSON-LD CSP hash. Serve with HTTPS and compression. Use short cache lifetimes for HTML; `_headers` uses one week for assets and one hour for CSS/JS. Filenames are not hashed, so purge hosting caches if you replace an asset in place.

The earlier hosted preview remains private. This repository contains the public website source for GitHub Pages. Pushing source does not enable Pages hosting; configure the deployment and final domain separately. Local hosting settings and capture notes stay outside the public repository. Private hosting requires sign-in and cannot be crawled by search engines. Make the website public or deploy `dist/` to a public host before requesting indexing in Google Search Console or Bing Webmaster Tools. Submit `/sitemap.xml`. SEO metadata and useful content help discovery; no website can guarantee a particular rank.

## Content and releases

Official repository: https://github.com/ArohaMusic/Aroha-Music-App
Contact: dandy-acetone-gone@duck.com

Download links use GitHub's stable `/releases/latest/download/Aroha-Music-latest.apk` endpoint. A published v1.0.0 release containing this exact asset was verified during creation. Future releases must retain the asset name. App capabilities are based on the project's README and documentation. Do not claim cloud sync, account login, casting, push notifications, iOS support or browser streaming.

The homepage and screenshot gallery use real captures of Aroha Music v1.1.0 preview. The visible UI is not reconstructed. Full-frame PNG originals are in `design/app-captures/`. Local capture metadata is excluded from publication. Screenshot buttons enlarge the real captures. There is no website music playback or fabricated UI. See `ASSETS.md` for asset provenance and licenses. The website has no analytics, tracking cookies or third-party runtime font/image requests.

## SEO

The pages ship complete HTML, descriptive titles, descriptions, canonical URLs, Open Graph/Twitter cards, SoftwareApplication/Organization/WebSite/FAQPage structured data, robots, sitemap and internal links. Page content remains readable without JavaScript. No invented reviews, ratings or download counts are used.

## Current local revision

The hero, feature descriptions, download section, FAQs and social/SEO metadata now use direct wording: ad-free music, a YouTube Music alternative, background playback, offline downloads, synced lyrics and no required account. An InnerTune alternative section explains Aroha without making unsupported superiority claims. No deployment was performed for this revision.

GitHub Pages project URLs may include a repository path. The current site uses root-relative URLs; before publishing under a repository subpath, configure that base path or use a dedicated `ArohaMusic.github.io` repository/custom domain. Canonical metadata must be changed to the final public origin.
