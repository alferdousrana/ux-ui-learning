/* ==========================================================================
   REMOTE DATA LAYER — interface only.
   Any cloud backend implements this contract. The app never calls Firebase
   directly; it talks to a RemoteStore through the SyncManager.
   ========================================================================== */
export class RemoteStore {
  /** @returns {Promise<{uid:string, name?:string}|null>} current signed-in user */
  async currentUser() { return null; }
  async signIn() { throw new Error('Not implemented'); }
  async signOut() {}
  /** Pull the remote learner document (or null). */
  async pull(uid) { return null; }
  /** Push the full learner document. */
  async push(uid, doc) { throw new Error('Not implemented'); }
  get available() { return false; }
}

/** Default: no remote. The app is fully functional offline with this. */
export class NullRemoteStore extends RemoteStore {}
