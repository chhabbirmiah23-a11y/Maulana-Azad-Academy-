import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDocFromServer
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDp1MrBJFzQbAX9fUuEUA5Br3Jfk7mSfLk",
  authDomain: "maulana-azad-academy.firebaseapp.com",
  projectId: "maulana-azad-academy",
  storageBucket: "maulana-azad-academy.firebasestorage.app",
  messagingSenderId: "955425115911",
  appId: "1:955425115911:web:c3988a53655175611f3fa2",
  measurementId: "G-QJNC3JBMCL"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


const dashboards = {
  student: "student-dashboard.html",
  teacher: "teacher-dashboard.html",
  staff: "staff-dashboard.html",
  admin: "admin-dashboard.html"
};


export async function getUserProfile(user) {

  const userRef = doc(db, "users", user.uid);

  // Force Firebase to read directly from the server
  const snap = await getDocFromServer(userRef);

  if (!snap.exists()) {
    throw new Error("NO_ROLE_PROFILE");
  }

  const data = snap.data();

  if (!["student", "teacher", "staff", "admin"].includes(data.role)) {
    throw new Error("INVALID_ROLE");
  }

  return data;
}


export async function redirectByRole(user) {

  const profile = await getUserProfile(user);

  const dashboard = dashboards[profile.role];

  if (!dashboard) {
    throw new Error("INVALID_ROLE");
  }

  window.location.replace(dashboard);
}


export async function login(email, password) {

  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  await redirectByRole(result.user);
}


export function protectPage(requiredRole, render) {

  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      window.location.replace("firebase-login.html");
      return;
    }

    try {

      const profile = await getUserProfile(user);

      if (profile.role !== requiredRole) {

        await signOut(auth);

        document.body.innerHTML = `
          <main style="font-family:Arial;text-align:center;padding:60px">
            <h2>Access denied</h2>
            <p>Your account does not have permission to open this dashboard.</p>
            <a href="firebase-login.html">Return to Login</a>
          </main>
        `;

        return;
      }

      render(user, profile);

    } catch (error) {

      console.error("DASHBOARD AUTH ERROR:", error);

      await signOut(auth);

      document.body.innerHTML = `
        <main style="font-family:Arial;text-align:center;padding:60px">
          <h2>Account setup required</h2>
          <p>Your account does not have a valid Academy role.</p>
        </main>
      `;
    }
  });
}


export async function logout() {

  await signOut(auth);

  window.location.replace("firebase-login.html");
}
