import { useEffect, useState } from 'react';
import { InAuthUser } from '@/models/in_auth_user';
import { GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import FirebaseClient from '@/models/firebase_client';

export default function useFirebaseAuth() {
  //Auth User 값을 반환
  const [authUser, setAuthUser] = useState<InAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      const signInResult = await signInWithPopup(FirebaseClient.getInstance().Auth, provider);

      if (signInResult.user) {
        console.info(signInResult.user);
      }
    } catch (err) {
      console.error(err);
    }
  }

  /** 모든걸 초기화 */
  const clear = () => {
    setAuthUser(null);
    setLoading(true);
  };

  const signOut = () => FirebaseClient.getInstance().Auth.signOut().then(clear);

  const AuthStateChanged = async (authState: User | null) => {
    if (authState === null) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setAuthUser({
      uid: authState.uid,
      email: authState.email,
      photoURL: authState.photoURL,
      displayName: authState.displayName,
    });

    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = FirebaseClient.getInstance().Auth.onAuthStateChanged(AuthStateChanged);
    return () => unsubscribe();
  }, []);
  return {
    authUser,
    loading,
    signInWithGoogle,
    signOut,
  };
}
