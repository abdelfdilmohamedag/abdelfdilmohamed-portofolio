# Firebase setup

The site is connected to project `afm-academic` and stores the main site snapshot in Firestore document `site/main`. Images and CV files stay local in the browser and are never uploaded to Firebase Storage.

## Enable authentication

1. Open Firebase Console for the project.
2. Go to **Authentication > Sign-in method**.
3. Enable **Anonymous** authentication.
4. Create the Firestore database. Storage is not required because media is stored locally.

## Deploy rules

Install Firebase CLI if it is not installed, then run from this folder:

```powershell
firebase login
firebase use afm-academic
firebase deploy --only firestore:rules

If the site shows `Missing or insufficient permissions`, the rules have not been deployed to this project yet. Run the commands above while signed in to the Firebase account that owns `afm-academic`.
```

The public site can read the published site document. Authenticated clients can update it and upload files under `site/`. The current browser implementation uses anonymous auth so the static site can work without a server.

## Production security

Anonymous auth is suitable for testing and a private static setup, but it is not a secure admin boundary. For production, create an email/password admin account or a custom-claims admin role and change the rules so only that role can write `/site/main` and Storage.