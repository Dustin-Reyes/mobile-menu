import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from 'config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const isAuthAvailable = !!auth;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isAuthAvailable);

  useEffect(() => {
    if (!isAuthAvailable) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [isAuthAvailable]);

  const signIn = useCallback(
    (email, password) => {
      if (!isAuthAvailable) {
        return Promise.reject(new Error('Authentication is not available'));
      }
      return signInWithEmailAndPassword(auth, email, password).then(
        (credential) => credential.user,
      );
    },
    [isAuthAvailable],
  );

  const logout = useCallback(() => {
    if (!isAuthAvailable) {
      return Promise.resolve();
    }
    return signOut(auth);
  }, [isAuthAvailable]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthAvailable,
      isAuthenticated: !!user,
      signIn,
      logout,
    }),
    [user, loading, isAuthAvailable, signIn, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
