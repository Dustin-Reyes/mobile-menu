import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { UserPlus, Users, ShieldCheck, ChevronRight } from 'lucide-react';
import SearchInput from 'components/ui/SearchInput';
import { useAuth } from 'context/AuthContext';
import { ROLE_LABELS, canManageUsers } from 'utils/roleHelpers';
import { getUserInitials } from 'utils/userHelpers';
import {
  getUserStatus,
  getProviderLabel,
  callUserManagement,
} from 'utils/admin/userHelpers';
import Button from 'components/ui/Button';
import { PageHeader, PageTitle, PageSubtitle } from '../shared/PageHeader';
import { SectionCard } from '../shared/SectionCard';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import CreateUserModal from './CreateUserModal';
import UserDetail from './UserDetail';

// ─── Motion ───────────────────────────────────────────────────────────────────

const motionProps = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

// ─── List view styled components ──────────────────────────────────────────────

const UserList = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: ${(p) => p.theme.borderRadius.s1};
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: background ${(p) => p.theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const UserAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.primary}30;
  color: ${(p) => p.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.bold};
  flex-shrink: 0;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserPrimary = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  color: ${(p) => p.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserSecondary = styled.div`
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  color: rgba(255, 255, 255, 0.3);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const BadgesRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const MobileRole = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    font-size: ${(p) => p.theme.typography.fontSizes.s2};
    color: rgba(255, 255, 255, 0.3);
    margin-top: 2px;
  }
`;

const MobileChevron = styled.div`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.2);
    flex-shrink: 0;
  }
`;

const SearchBar = styled.div`
  margin-bottom: 12px;
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  font-weight: ${(p) => p.theme.typography.fontWeights.medium};
  background: ${(p) => p.theme.colors.primary}18;
  color: ${(p) => p.theme.colors.primary};
  border: 1px solid ${(p) => p.theme.colors.primary}30;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  background: ${(p) =>
    p.$disabled ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'};
  color: ${(p) => (p.$disabled ? '#f87171' : '#4ade80')};
  border: 1px solid
    ${(p) => (p.$disabled ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)')};
  white-space: nowrap;
`;

const ProviderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: ${(p) => p.theme.typography.fontSizes.s2};
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  white-space: nowrap;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.2);
  font-size: ${(p) => p.theme.typography.fontSizes.s3};
  text-align: center;
`;

const ErrorState = styled(EmptyState)`
  color: #f87171;
`;

const RetryButton = styled(Button)`
  margin-top: 8px;
`;

const AddUserButton = styled(Button)`
  gap: 6px;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    padding: 0;
    min-width: unset;
    border-radius: ${(p) => p.theme.borderRadius.s1};
    flex-shrink: 0;

    span {
      display: none;
    }
  }
`;

const UsersIcon = styled(Users)`
  opacity: 0.3;
`;

// ─── Main component ───────────────────────────────────────────────────────────

export default function UsersTab() {
  const { user, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [view, setView] = useState('list');
  const [detailUser, setDetailUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      setFetchError(null);
      const data = await callUserManagement('list', user);
      setUsers(data.users);
      return data.users;
    } catch (err) {
      setFetchError(err.message || 'Failed to load users');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRowClick = (u) => {
    setDetailUser(u);
    setView('detail');
  };

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        (u.displayName ?? '').toLowerCase().includes(q) ||
        (u.email ?? '').toLowerCase().includes(q),
    );
  }, [users, search]);

  const handleBack = () => {
    setView('list');
    setDetailUser(null);
  };

  // After any mutation in the detail view: reload list and refresh the detail snapshot
  const handleUpdated = useCallback(async () => {
    const fresh = await loadUsers();
    if (detailUser && fresh) {
      const refreshed = fresh.find((u) => u.uid === detailUser.uid);
      if (refreshed) setDetailUser(refreshed);
    }
  }, [loadUsers, detailUser]);

  const handleDeleted = () => {
    loadUsers();
    handleBack();
  };

  if (view === 'detail' && detailUser) {
    return (
      <div>
        <PageHeader>
          <div>
            <PageTitle>Users</PageTitle>
            <PageSubtitle>Manage team members and their roles</PageSubtitle>
          </div>
        </PageHeader>
        <UserDetail
          targetUser={detailUser}
          callerRole={userRole}
          onBack={handleBack}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      </div>
    );
  }

  return (
    <motion.div key="users-list" {...motionProps}>
      <PageHeader>
        <div>
          <PageTitle>Users</PageTitle>
          <PageSubtitle>Manage team members and their roles</PageSubtitle>
        </div>
        {canManageUsers(userRole) && (
          <AddUserButton
            onClick={() => setShowCreate(true)}
            title="Add user"
            aria-label="Add user"
          >
            <UserPlus size={16} />
            <span>Add User</span>
          </AddUserButton>
        )}
      </PageHeader>

      <SearchBar>
        <SearchInput
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </SearchBar>

      <SectionCard>
        {loading && <LoadingSpinner />}

        {!loading && fetchError && (
          <ErrorState>
            <span>Failed to load users: {fetchError}</span>
            <RetryButton variant="secondary" onClick={loadUsers}>
              Retry
            </RetryButton>
          </ErrorState>
        )}

        {!loading && !fetchError && users.length === 0 && (
          <EmptyState>
            <UsersIcon size={32} />
            No users found
          </EmptyState>
        )}

        {!loading &&
          !fetchError &&
          filteredUsers.length === 0 &&
          users.length > 0 && (
            <EmptyState>No users match your search</EmptyState>
          )}

        {!loading && !fetchError && filteredUsers.length > 0 && (
          <UserList>
            {filteredUsers.map((u) => {
              const status = getUserStatus(u);
              return (
                <UserRow key={u.uid} onClick={() => handleRowClick(u)}>
                  <UserAvatar>
                    {u.photoURL ? (
                      <AvatarImage
                        src={u.photoURL}
                        alt=""
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      getUserInitials(u.email)
                    )}
                  </UserAvatar>

                  <UserInfo>
                    <UserPrimary title={u.displayName ?? u.email}>
                      {u.displayName ?? u.email}
                    </UserPrimary>
                    <UserSecondary>{u.email}</UserSecondary>
                    <MobileRole>
                      {u.role ? (ROLE_LABELS[u.role] ?? u.role) : null}
                    </MobileRole>
                  </UserInfo>

                  <BadgesRow>
                    {u.role && (
                      <RoleBadge>
                        <ShieldCheck size={10} />
                        {ROLE_LABELS[u.role] ?? u.role}
                      </RoleBadge>
                    )}
                    <ProviderBadge>
                      {getProviderLabel(u.providers)}
                    </ProviderBadge>
                    <StatusBadge $disabled={status === 'disabled'}>
                      {status === 'disabled' ? 'Disabled' : 'Active'}
                    </StatusBadge>
                  </BadgesRow>

                  <MobileChevron>
                    <ChevronRight size={16} />
                  </MobileChevron>
                </UserRow>
              );
            })}
          </UserList>
        )}
      </SectionCard>

      <CreateUserModal
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={loadUsers}
        callerRole={userRole}
      />
    </motion.div>
  );
}
