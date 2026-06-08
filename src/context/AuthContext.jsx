/**
 * Authentication context and provider.
 *
 * Wraps the application in a Firebase Auth listener and exposes the current
 * user, their custom-claim role, and helper methods (signIn, logout,
 * refreshUserRole, reloadUser) via the `useAuth` hook.
 *
 * When Firebase Auth is not configured (`auth === null`) all async methods
 * resolve/reject gracefully and `loading` is set to `false` immediately.
 *
 * @module context/AuthContext
 */
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
import globalErrorHandler from 'utils/errorHandler';

const AuthContext = createContext(null);

/**
 * Provides authentication state to all descendant components.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that gain access to auth context.
 * @returns {JSX.Element}
 */
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
      } catch (error) {
        setUserRole(null);
        globalErrorHandler.reportError(error, {
          action: 'load-user-role',
          uid: currentUser.uid,
        });
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

      if (currentUser) {
        globalErrorHandler.setUser({
          id: currentUser.uid,
          email: currentUser.email,
        });
      } else {
        globalErrorHandler.clearUser();
      }
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

/**
 * Consumes the authentication context.
 *
 * Must be called inside an `<AuthProvider>` tree. Throws if used outside one.
 *
 * @returns {{
 *   user: import('firebase/auth').User | null,
 *   userRole: string | null,
 *   loading: boolean,
 *   isAuthAvailable: boolean,
 *   isAuthenticated: boolean,
 *   isAdmin: boolean,
 *   canManageUsers: boolean,
 *   signIn: (email: string, password: string) => Promise<import('firebase/auth').User>,
 *   logout: () => Promise<void>,
 *   refreshUserRole: () => Promise<void>,
 *   reloadUser: () => Promise<void>
 * }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
