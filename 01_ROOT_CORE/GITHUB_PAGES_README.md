# DOC-FULL-NR Smart Worksheet — GitHub Pages Fixed

This version fixes the blank white GitHub Pages screen.

## Why the old GitHub Pages page was blank

A Vite/React source repository cannot be served correctly as raw static files.
The application must be built to `dist/`, and project-page asset paths and SPA
routing must also work under a repository sub-path.

This package fixes all of those items:

- Vite uses `base: "./"`
- React uses `HashRouter`
- GitHub Actions builds the Vite app and deploys `dist/`
- Firebase Web Config is generated into `public/firebase-config.js`
- The Firebase Web Config is public client configuration, not an Admin private key
- `.env.local` and service-account private keys are still excluded from GitHub

## Firebase project

`doc-full-nr`

## Admin

- Email: `pisite.2543nac@gmail.com`
- Login ID: `pisit2000`

No password is stored in the repository.

## First: prepare the project for GitHub Pages

Run:

`07_PREPARE_GITHUB_PAGES.bat`

This generates:

`public/firebase-config.js`

and verifies the Vite build.

Then push/upload the **contents of this folder** to the root of the GitHub repository.

## GitHub settings

Repository:

`Settings → Pages → Build and deployment → Source → GitHub Actions`

After pushing, open `Actions` and wait until **Deploy GitHub Pages** is green.

The deployed link will use hash routes, for example:

`https://USERNAME.github.io/REPOSITORY/#/login`

## Local use

`01_RUN_DOC_FULL_NR.bat`

Local login:

`http://localhost:5174/#/login`

## Online test

After GitHub Pages deployment succeeds, open the Pages link.
The app should show the DOC-FULL-NR login/admin UI instead of a blank page.


## Easier GitHub upload in 5 sets

If you do not want to upload all files at once:

1. Run `07_PREPARE_GITHUB_PAGES.bat`
2. Run `08_CREATE_GITHUB_UPLOAD_SETS.bat`
3. Open `GITHUB_UPLOAD_SETS`
4. Upload the contents of each set in numerical order
5. Upload `05_GITHUB_ACTIONS_UPLOAD_LAST` last
