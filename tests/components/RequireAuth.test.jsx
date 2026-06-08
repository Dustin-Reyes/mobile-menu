import React from 'react';
import { render, screen } from '../utils/test-utils';
import RequireAuth from 'components/auth/RequireAuth';

// Control useAuth return values without touching the real Firebase/AuthProvider
jest.mock('context/AuthContext', () => ({
  ...jest.requireActual('context/AuthContext'),
  useAuth: jest.fn(),
}));

// Replace Login with a sentinel so tests don't need Firebase to render it
jest.mock('components/auth/Login', () => {
  function MockLogin() {
    return <div>Login form</div>;
  }
  return MockLogin;
});

// Replace LoadingSpinner with a sentinel
jest.mock('components/admin/shared/LoadingSpinner', () => ({
  // eslint-disable-next-line react/display-name
  LoadingSpinner: () => <div>Loading...</div>,
}));

import { useAuth } from 'context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mockAuth(overrides = {}) {
  useAuth.mockReturnValue({
    loading: false,
    isAuthAvailable: true,
    isAuthenticated: false,
    userRole: null,
    ...overrides,
  });
}

function renderGate() {
  return render(
    <RequireAuth>
      <div>Dashboard content</div>
    </RequireAuth>,
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('RequireAuth — Firebase unavailable', () => {
  it('shows "Admin unavailable" when Firebase is not configured', () => {
    mockAuth({ isAuthAvailable: false });
    renderGate();
    expect(screen.getByText('Admin unavailable')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });
});

describe('RequireAuth — loading state', () => {
  it('shows a spinner while auth is resolving', () => {
    mockAuth({ loading: true });
    renderGate();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });
});

describe('RequireAuth — unauthenticated', () => {
  it('renders the Login form when no user is signed in', () => {
    mockAuth({ isAuthenticated: false });
    renderGate();
    expect(screen.getByText('Login form')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });
});

describe('RequireAuth — authenticated but no role', () => {
  it('shows "Access denied" when userRole is null', () => {
    mockAuth({ isAuthenticated: true, userRole: null });
    renderGate();
    expect(screen.getByText('Access denied')).toBeInTheDocument();
    expect(
      screen.getByText(/does not have a role assigned/i),
    ).toBeInTheDocument();
    expect(screen.queryByText('Dashboard content')).not.toBeInTheDocument();
  });

  it('does not show the Login form for a role-less authenticated user', () => {
    mockAuth({ isAuthenticated: true, userRole: null });
    renderGate();
    expect(screen.queryByText('Login form')).not.toBeInTheDocument();
  });
});

describe('RequireAuth — authenticated with a valid role', () => {
  it.each(['admin', 'site_manager', 'content_manager'])(
    'renders children for role "%s"',
    (role) => {
      mockAuth({ isAuthenticated: true, userRole: role });
      renderGate();
      expect(screen.getByText('Dashboard content')).toBeInTheDocument();
    },
  );

  it('does not show "Access denied" when a role is assigned', () => {
    mockAuth({ isAuthenticated: true, userRole: 'admin' });
    renderGate();
    expect(screen.queryByText('Access denied')).not.toBeInTheDocument();
  });
});
