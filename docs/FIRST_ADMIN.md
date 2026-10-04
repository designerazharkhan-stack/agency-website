# First admin account

1. Configure Firebase as described in [Firebase setup](./FIREBASE_SETUP.md).
2. In Firebase Console, open **Authentication → Users** and add the first
   account with email/password. There is intentionally no public sign-up.
3. On a trusted operator machine, install Google Cloud CLI and authenticate
   Application Default Credentials:

   ```sh
   gcloud auth application-default login
   export GOOGLE_CLOUD_PROJECT=your-firebase-project-id
   npm run grant:admin -- you@example.com
   ```

   The operator's Google identity needs permission to administer Firebase
   Authentication. The script uses the local ADC credential provider, preserves
   existing custom claims, and sets `admin: true`. It does not write or copy
   credentials into this repository.
4. Visit `/admin/login`, sign in, and open the dashboard. If the user was
   already signed in when promoted, sign out and back in to refresh the ID
   token.

The frontend route guard improves the user experience but is not the security
boundary. Firestore and Storage Security Rules independently require the
verified custom claim for privileged operations. Never grant claims from the
browser or commit credential files.
