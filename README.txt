SETUP ORDER

1. Upload these files to the same GitHub Pages folder:
   firebase-login.html
   firebase-common.js
   dashboard.css
   student-dashboard.html
   teacher-dashboard.html
   staff-dashboard.html
   admin-dashboard.html

2. In Firebase Authentication > Users, create your accounts.

3. In Firestore create collection `users`.
   The document ID MUST equal the Firebase Authentication user's UID.

   Example:
   users/PASTE_UID_HERE
   {
     name: "Student Name",
     role: "student"
   }

   Roles: student, teacher, staff, admin

4. IMPORTANT BOOTSTRAP:
   Create the first admin's `users/{UID}` document BEFORE publishing
   the rules, because only an existing admin can create/edit role documents.

5. Firestore > Rules: replace the rules with firestore.rules from this package,
   then Publish.

6. Login automatically reads the role and redirects:
   student -> student-dashboard.html
   teacher -> teacher-dashboard.html
   staff -> staff-dashboard.html
   admin -> admin-dashboard.html

7. If a student manually opens teacher-dashboard.html, the page checks the
   Firebase role and shows Access denied. Firestore rules separately protect data.

SECURITY NOTE
Do not store passwords in Firestore. Firebase Authentication handles passwords.
The Firebase web API key is not a password; Firestore Security Rules are what
protect the database.
