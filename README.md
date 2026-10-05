# Agency Website

A premium, dark-luxury digital agency website and content studio. The public
site runs on bundled demo content before Firebase is configured; when connected,
Firebase Authentication, Cloud Firestore and Cloud Storage provide the CMS,
admin sign-in, and image uploads.

## Tech stack

- React 19, TypeScript 6 and Vite 8
- Tailwind CSS 3 and Framer Motion
- React Router 7
- Firebase Authentication, Cloud Firestore and Cloud Storage
- Firebase Hosting

## Project structure

```text
src/
  components/     Shared public, home, UI, admin and shared-zone components
  context/        Site-content, Shared Zone and authentication providers
  data/defaults/  Demo content and Firestore seed content
  hooks/          Async, scroll, toast and admin data hooks
  lib/            Firebase adapters, validation, SEO and shared utilities
  pages/          Public routes and admin screens
  types/          Shared content models
firebase/         Firestore and Storage Security Rules
public/           Favicon, social image, manifest and robots.txt
```

## Installation and local development

Requires Node.js 22.12 or later and npm.

```sh
npm ci
npm run dev
```

The app works without Firebase using bundled defaults. To connect Firebase,
copy `.env.example` to `.env.local` and add the public Web App configuration
from Firebase Console → Project settings → Your apps. Never put service-account
JSON, private keys, or Admin SDK credentials in a `VITE_` variable or the
frontend.

## Commands

```sh
npm run dev        # Vite development server
npm run typecheck  # TypeScript project check
npm run lint       # Oxlint
npm run build      # Typecheck and production build
npm run preview    # Serve the production build locally
```

## Firebase setup

1. Create a Firebase project and register a Web App.
2. Enable **Authentication → Email/Password**.
3. Create a **Cloud Firestore** database and a **Cloud Storage** bucket.
4. Copy `.env.example` to `.env.local`; set `VITE_FIREBASE_API_KEY`,
   `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, and
   `VITE_FIREBASE_APP_ID`. Set the bucket and sender ID values from the same
   Web App configuration as well.
5. Install the Firebase CLI on your development machine, authenticate with
   `firebase login`, and select your project with `firebase use --add`.
6. Deploy the rules from the repository root:

   ```sh
   firebase deploy --only firestore:rules,storage
   ```

   Rules live in `firebase/firestore.rules` and `firebase/storage.rules`.
   Content documents are publicly readable only when published; site settings
   are public; writes require the `admin: true` Firebase Authentication custom
   claim. Contact submissions can be created by the public form after strict
   field and size validation, but only admins can list or modify them.
7. Restart Vite after changing environment variables.

Firebase Web SDK configuration is intentionally public. Security is enforced
by Authentication custom claims and deployed Firestore / Storage rules, not by
hiding the Web App API key.

### Admin access

There is no public sign-up. Create the account using Firebase Authentication,
then have a trusted operator grant the Firebase custom claim `admin: true`.
For a local trusted machine, install Google Cloud CLI, authenticate with
Application Default Credentials, and grant the claim with:

```sh
gcloud auth application-default login
export GOOGLE_CLOUD_PROJECT=your-firebase-project-id
npm run grant:admin -- you@example.com
```

The operator's Google identity needs permission to administer Firebase
Authentication. The script merges the `admin` claim into existing custom
claims; it does not print or store credentials. Never ship service-account
credentials to the browser, commit them, or add them to the repository. After
granting the claim, the user must sign out and back in (or refresh the session)
so the ID token is renewed. Admin routes are guarded in the UI, and the
database and storage rules independently authorize every privileged read and
write.

### Local Firebase emulators

Set `VITE_USE_FIREBASE_EMULATORS=true` in `.env.local` and start the Auth,
Firestore, and Storage emulators with the Firebase CLI before running Vite.
The app connects to the default local ports: Auth `9099`, Firestore `8080`, and
Storage `9199`.

## Content studio

The dashboard is available at `/admin/login`. Without Firebase it displays a
clear setup state and keeps the public site usable. With Firebase configured,
admins can edit site settings and homepage sections, manage services, and use
the dashboard's content tools. The bundled defaults can be seeded to Firestore
from the overview screen; seed access is restricted by the same admin rules as
all other writes.

The dashboard's **Shared Zone** (`/admin/dashboard/shared-zone`) is the
canonical site-wide configuration. It stores brand colors and artwork,
announcements, contact details and business hours, social links, trust metrics,
the global CTA, footer links and newsletter promotion, and default SEO metadata
in one `settings/sharedZone` Firestore document. Public UI components consume
that shared provider so changes propagate to the navigation, homepage, contact
page, SEO metadata and footer. Older `/admin/dashboard/settings` and
`/admin/dashboard/seo` URLs redirect to the corresponding Shared Zone editor
sections; existing legacy setting documents are used as migration fallbacks.

## Production build and Firebase Hosting

```sh
npm run typecheck
npm run lint
npm run build
firebase deploy --only hosting
```

`firebase.json` serves the Vite `dist/` output and rewrites client-side routes
to `index.html`. Review the canonical `VITE_SITE_URL`, metadata, social image,
and contact details before publishing. `public/robots.txt` disallows admin
routes from indexing.

## GitHub workflow

Use pull requests for changes. A production workflow should install with
`npm ci`, run `npm run typecheck`, `npm run lint`, and `npm run build`, then
deploy only from a protected branch using GitHub Actions secrets / workload
identity. Do not commit `.env.local`, Firebase service-account files, or
deployment credentials.
