import { initializeApp } from "firebase/app";
import { getAuth, indexedDBLocalPersistence, browserLocalPersistence, setPersistence, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);

// Initialize auth with standard entry point so all dependencies are registered
const auth = getAuth(app);

// Explicitly set persistence to indexedDB as requested
setPersistence(auth, indexedDBLocalPersistence).catch((err) => {
  console.warn("Failed to set explicit auth persistence:", err);
});

const googleProvider = new GoogleAuthProvider();

// Initialize firestore with persistent local cache and multi-tab sync
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
}, firebaseConfig.firestoreDatabaseId);

export { app, auth, db, googleProvider };


