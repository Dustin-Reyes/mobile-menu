import styled from '@emotion/styled';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from 'context/AuthContext';
import AdminLogin from './AdminLogin';
import { LoadingSpinner } from './AdminDashboard.styles';

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

export default function RequireAuth({ children }) {
  const { loading, isAuthAvailable, isAuthenticated } = useAuth();

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
    return <AdminLogin />;
  }

  return children;
}
