/* ==========================================================================
   Firebase implementation of RemoteStore — NOT ACTIVE in v1.
   To enable later:
   1. Create a Firebase project; enable Authentication (Google) and Firestore.
   2. Fill js/firebase/config.js.
   3. In js/firebase/sync.js, replace `new NullRemoteStore()` with
      `await FirebaseRemoteStore.create(firebaseConfig)`.
   4. Add the Firebase SDK URLs to the service worker's network allow-list.
   Firestore layout: users/{uid}  -> { profile, progress doc, updatedAt }
   Security rules: allow read, write: if request.auth.uid == uid;
   ========================================================================== */
import { RemoteStore } from './remote-store.js';

export class FirebaseRemoteStore extends RemoteStore {
  static async create(config) {
    // Loaded lazily so the offline build never downloads Firebase.
    const v = '10.12.2';
    const app = await import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${v}/firebase-app.js`);
    const auth = await import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${v}/firebase-auth.js`);
    const fs = await import(/* @vite-ignore */ `https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`);
    const inst = new FirebaseRemoteStore();
    inst.fb = { app: app.initializeApp(config), auth, fs };
    inst.authObj = auth.getAuth(inst.fb.app);
    inst.db = fs.getFirestore(inst.fb.app);
    return inst;
  }
  get available() { return !!this.db; }
  async currentUser() { const u = this.authObj.currentUser; return u ? { uid: u.uid, name: u.displayName } : null; }
  async signIn() { const { GoogleAuthProvider, signInWithPopup } = this.fb.auth; const r = await signInWithPopup(this.authObj, new GoogleAuthProvider()); return { uid: r.user.uid, name: r.user.displayName }; }
  async signOut() { await this.fb.auth.signOut(this.authObj); }
  async pull(uid) { const { doc, getDoc } = this.fb.fs; const s = await getDoc(doc(this.db, 'users', uid)); return s.exists() ? s.data().learner : null; }
  async push(uid, learner) { const { doc, setDoc } = this.fb.fs; await setDoc(doc(this.db, 'users', uid), { learner, updatedAt: Date.now() }, { merge: true }); }
}
