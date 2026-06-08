/**
 * @module components/auth/RequireAuth
 * @description A route-guard wrapper that conditionally renders its children based on the
 * current authentication state from `AuthContext`. Handles four states: auth unavailable
 * (Firebase not configured), loading, unauthenticated (redirects to the Login page), and
 * access denied (user has no assigned role).
 */

import styled from '@emotion/styled';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import Login from './Login';
import { LoadingSpinner } from '../admin/shared/LoadingSpinner';

const CenteredMessage = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 2rem;
  text-align: center;
  color: ${(p) => p.theme.colors.textSecondary};
`;

const MessageTitle = styled.h1`
  font-size: ${(p) => p.theme.typography.fontSizes.s6};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  color: ${(p) => p.theme.colors.text};
  margin: 0;
`;

const MessageBody = styled.p`
  max-width: 420px;
  margin: 0;
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  line-height: ${(p) => p.theme.typography.lineHeights.relaxed};
`;

/**
 * RequireAuth route-guard component. Wraps protected routes and renders the appropriate UI
 * based on auth state: a config-error message, a loading spinner, the Login page, an
 * access-denied message, or the protected `children`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected content to render when authenticated.
 * @returns {JSX.Element}
 */
export default function RequireAuth({ children }) {
  const { loading, isAuthAvailable, isAuthenticated, userRole } = useAuth();

  if (!isAuthAvailable) {
    return (
      <CenteredMessage>
        <ShieldAlert size={32} />
        <MessageTitle>Admin unavailable</MessageTitle>
        <MessageBody>
          Authentication is not configured. Set the Firebase environment
          variables (and <code>VITE_CMS_ENABLED=true</code>) to enable the admin
          dashboard.
        </MessageBody>
      </CenteredMessage>
    );
  }

  if (loading) {
    return (
      <CenteredMessage>
        <LoadingSpinner />
      </CenteredMessage>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  if (userRole === null) {
    return (
      <CenteredMessage>
        <ShieldAlert size={32} />
        <MessageTitle>Access denied</MessageTitle>
        <MessageBody>
          Your account does not have a role assigned. Contact an administrator
          to be granted access.
        </MessageBody>
      </CenteredMessage>
    );
  }

  return children;
}
