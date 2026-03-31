// Provide a factory so Jest does not try to auto-import (and execute) the
// real authContext module, which would trigger the Firebase → undici chain.
jest.mock('../../context/authContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Navigate: ({ to, replace, state }) => (
    <div data-testid="navigate" data-to={to} data-replace={String(replace)} data-state={JSON.stringify(state)} />
  ),
  useLocation: () => ({ pathname: '/protected' }),
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import { useAuth } from '../../context/authContext';
import { RequireAuth, RequireAdmin } from '../../components/routeGuards';

const mockUseAuth = useAuth;

function setup(authValue) {
  mockUseAuth.mockReturnValue(authValue);
}

describe('RequireAuth', () => {
  it('shows loading message while auth state is being determined (user === undefined)', () => {
    setup({ user: undefined, isAdmin: false });

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Checking your account...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is null (signed out)', () => {
    setup({ user: null, isAdmin: false });

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    );

    const nav = screen.getByTestId('navigate');
    expect(nav).toHaveAttribute('data-to', '/login');
    expect(nav).toHaveAttribute('data-replace', 'true');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('preserves the current location in redirect state', () => {
    setup({ user: null, isAdmin: false });

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    );

    const nav = screen.getByTestId('navigate');
    const state = JSON.parse(nav.getAttribute('data-state'));
    expect(state).toEqual({ from: '/protected' });
  });

  it('renders children when user is authenticated', () => {
    setup({ user: { uid: 'u1', email: 'user@example.com' }, isAdmin: false });

    render(
      <RequireAuth>
        <div>Protected Content</div>
      </RequireAuth>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});

describe('RequireAdmin', () => {
  it('shows loading message while auth state is being determined (user === undefined)', () => {
    setup({ user: undefined, isAdmin: false });

    render(
      <RequireAdmin>
        <div>Admin Panel</div>
      </RequireAdmin>
    );

    expect(screen.getByText('Checking admin access...')).toBeInTheDocument();
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('redirects to /login when user is null (signed out)', () => {
    setup({ user: null, isAdmin: false });

    render(
      <RequireAdmin>
        <div>Admin Panel</div>
      </RequireAdmin>
    );

    const nav = screen.getByTestId('navigate');
    expect(nav).toHaveAttribute('data-to', '/login');
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('redirects to /account when user is authenticated but not an admin', () => {
    setup({ user: { uid: 'u1', email: 'user@example.com' }, isAdmin: false });

    render(
      <RequireAdmin>
        <div>Admin Panel</div>
      </RequireAdmin>
    );

    const nav = screen.getByTestId('navigate');
    expect(nav).toHaveAttribute('data-to', '/account');
    expect(screen.queryByText('Admin Panel')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated and is an admin', () => {
    setup({ user: { uid: 'u1', email: 'admin@example.com' }, isAdmin: true });

    render(
      <RequireAdmin>
        <div>Admin Panel</div>
      </RequireAdmin>
    );

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
