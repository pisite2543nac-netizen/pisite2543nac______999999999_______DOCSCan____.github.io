# DOC-FULL-NR Smart Worksheet — Full GitHub Browser Upload Edition

Firebase project:

`doc-full-nr`

Admin:

- Email: `pisite.2543nac@gmail.com`
- Firestore Login ID: `pisit2000`

This is the **full source project**, plus a one-click tool that splits the project
into 5 smaller GitHub browser-upload sets.

## Why this edition exists

The previous GitHub Actions method required a hidden `.github` folder, which can
be awkward to select in Windows/browser upload dialogs.

This edition avoids that problem entirely.

It builds the Vite/React website into:

`docs/`

and GitHub Pages serves the site directly from the `main` branch `/docs` folder.

## One-click preparation

Run:

`00_PREPARE_ALL_FOR_GITHUB.bat`

It automatically:

1. installs packages if needed
2. logs in to Firebase
3. fetches Firebase Web config for `doc-full-nr`
4. deploys Firestore Rules and indexes
5. builds the production website
6. creates `docs/`
7. creates `GITHUB_UPLOAD_SETS/`

## Upload sets

Upload and commit in this exact order:

1. `01_ROOT_CORE`
2. `02_SRC_CORE`
3. `03_SRC_PAGES`
4. `04_SCRIPTS_PUBLIC_TOOLS`
5. `05_DOCS_WEBSITE_UPLOAD_LAST`

For every set, upload the **contents inside the set**, not the numbered set folder itself.

## GitHub Pages

After all 5 sets are committed:

`Settings → Pages`

Select:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

The online routes use `HashRouter`, for example:

`#/login`

## Included application modules

- Firebase Authentication admin login/setup
- Firestore Admin profile
- System settings
- Users view
- Subjects
- preset semester 1/2569 subjects
- Classrooms
- Worksheets
- Draft / Publish / Close
- Firestore Security Rules
- Firestore indexes
- Firebase Hosting config
- GitHub Pages static build
- local Windows launch/deploy tools

Sensitive collections remain browser-write locked:

- submissions
- submissionGrades
- submissionOverrides
- auditLogs

These are reserved for a future Cloud Functions / server layer.
