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
import { canManageUsers } from 'utils/roleHelpers';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const isAuthAvailable = !!auth;
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(isAuthAvailable);

  const loadUserRole = useCallback(
    async (currentUser, forceRefresh = false) => {
      if (!currentUser) {
        setUserRole(null);
        return;
      }
      try {
        const tokenResult = await currentUser.getIdTokenResult(forceRefresh);
        setUserRole(tokenResult.claims.role ?? null);
      } catch {
        setUserRole(null);
      }
    },
    [],
  );

  useEffect(() => {
    if (!isAuthAvailable) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await loadUserRole(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [isAuthAvailable, loadUserRole]);

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

  // Force-refresh the ID token to pick up a newly assigned custom claim role
  const refreshUserRole = useCallback(async () => {
    if (user) {
      await loadUserRole(user, true);
    }
  }, [user, loadUserRole]);

  const reloadUser = useCallback(async () => {
    const current = auth.currentUser;
    if (current) {
      await current.reload();
      setUser(null);
      setUser(auth.currentUser);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      userRole,
      loading,
      isAuthAvailable,
      isAuthenticated: !!user,
      isAdmin: userRole === 'admin',
      canManageUsers: canManageUsers(userRole),
      signIn,
      logout,
      refreshUserRole,
      reloadUser,
    }),
    [
      user,
      userRole,
      loading,
      isAuthAvailable,
      signIn,
      logout,
      refreshUserRole,
      reloadUser,
    ],
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
