# Firebase setup

The public site runs on bundled defaults until the Firebase Web App is
configured. Firebase Web App settings are public identifiers, not privileged
credentials. Never put an Admin SDK private key or service-account JSON in a
`VITE_` variable.

1. Create a Firebase project and register a Web App.
2. Enable **Authentication → Email/Password**.
3. Create a Cloud Firestore database and a Cloud Storage bucket.
4. Copy `.env.example` to `.env.local` and fill in the Web App values:
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`,
   `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`,
   `VITE_FIREBASE_MESSAGING_SENDER_ID`, and `VITE_FIREBASE_APP_ID`.
5. Install and sign in to the Firebase CLI, select the project with
   `firebase use --add`, and deploy the security rules:

   ```sh
   firebase deploy --only firestore:rules,storage
   ```

   The Firestore rules allow public reads only for published content and public
   settings. Admin reads/writes require the `admin: true` Auth custom claim.
   Visitors can only create validated contact messages; only admins can read,
   update, or delete submissions. Storage reads are public for site media,
   while image uploads, replacements, and deletions require an admin claim.
6. Start the app with `npm run dev`. Restart it after changing `.env.local`.

For local emulators, set `VITE_USE_FIREBASE_EMULATORS=true` and start Auth
(9099), Firestore (8080), and Storage (9199) emulators before the Vite server.
The app connects to those loopback ports automatically.

See the root [README](../README.md) for installation, builds, Hosting, and
production deployment.
