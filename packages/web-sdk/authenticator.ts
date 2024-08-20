import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getIdToken,
  sendEmailVerification,
} from "firebase/auth";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

class Authenticator {
  private auth: Auth;

  constructor(firebaseConfig: FirebaseConfig) {
    const app: FirebaseApp = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
  }

  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      userCredential.user && sendEmailVerification(userCredential.user);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getCurrentUserToken(forceRefresh: boolean = false): Promise<string | null> {
    const user: User | null = this.auth.currentUser;

    if (user) {
      try {
        const idToken = await getIdToken(user, forceRefresh);
        return idToken;
      } catch (error) {
        throw new Error("Failed to retrieve ID token: " + (error as Error).message);
      }
    } else {
      return null; // User is not signed in
    }
  }

  onAuthStateChange(callback: (isSignedIn: boolean, user: User | null) => void): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        callback(true, user);
      } else {
        callback(false, null);
      }
    });
  }
}

export default Authenticator;
