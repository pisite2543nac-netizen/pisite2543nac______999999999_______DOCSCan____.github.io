import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const runtimeConfig =
  typeof window !== "undefined"
    ? window.__FIREBASE_CONFIG__
    : null;

const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const config = runtimeConfig || envConfig;

const missing = Object.entries(config || {})
  .filter(([, value]) => !value || String(value).startsWith("REPLACE_"))
  .map(([key]) => key);

if (!config || missing.length) {
  throw new Error(
    "Firebase Web Config is missing. Run 00_INSTALL_DOC_FULL_NR.bat before uploading to GitHub."
  );
}

if (config.projectId !== "doc-full-nr") {
  throw new Error(
    `Wrong Firebase project: ${config.projectId}. Expected doc-full-nr.`
  );
}

const app = initializeApp(config);

export const auth = getAuth(app);
export const db = getFirestore(app);
