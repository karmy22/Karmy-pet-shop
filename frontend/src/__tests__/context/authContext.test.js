// Mock firebase modules before any imports
jest.mock('../../firebase', () => ({
  app: {},
  auth: {},
  googleProvider: {},
}));

const mockOnAuthStateChanged = jest.fn();
const mockSignOut = jest.fn();
const mockSendPasswordResetEmail = jest.fn();
const mockUpdateProfile = jest.fn();

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args) => mockOnAuthStateChanged(...args),
  signOut: (...args) => mockSignOut(...args),
  sendPasswordResetEmail: (...args) => mockSendPasswordResetEmail(...args),
  updateProfile: (...args) => mockUpdateProfile(...args),
}));

import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/authContext';

function AuthRef() {
  const auth = useAuth();
  AuthRef.latest = auth;
  return null;
}

function renderAuth() {
  render(
    <AuthProvider>
      <AuthRef />
    </AuthProvider>
  );
}

beforeEach(() => {
  mockOnAuthStateChanged.mockReset();
  mockSignOut.mockReset();
  mockSendPasswordResetEmail.mockReset();
  mockUpdateProfile.mockReset();
});

describe('AuthProvider – loading state', () => {
  it('starts with user as undefined (loading) before auth state resolves', () => {
    mockOnAuthStateChanged.mockReturnValue(() => {});

    renderAuth();

    expect(AuthRef.latest.user).toBeUndefined();
  });

  it('calls onAuthStateChanged with the firebase auth instance', () => {
    mockOnAuthStateChanged.mockReturnValue(() => {});

    renderAuth();

    expect(mockOnAuthStateChanged).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes from auth state changes on unmount', () => {
    const unsubscribe = jest.fn();
    mockOnAuthStateChanged.mockReturnValue(unsubscribe);

    const { unmount } = render(
      <AuthProvider>
        <AuthRef />
      </AuthProvider>
    );

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});

describe('AuthProvider – signed-out state', () => {
  it('sets user to null when Firebase reports no user', () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    renderAuth();

    expect(AuthRef.latest.user).toBeNull();
  });
});

describe('AuthProvider – signed-in state', () => {
  it('sets user to the Firebase user object', () => {
    const fakeUser = { uid: 'u1', email: 'user@example.com', displayName: 'Alice' };
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(fakeUser);
      return () => {};
    });

    renderAuth();

    expect(AuthRef.latest.user).toBe(fakeUser);
  });
});

// The adminEmails list is evaluated at module-load time from process.env.
// Tests that need a custom admin list must use jest.isolateModules() to
// reload the module after setting the env variable.
describe('AuthProvider – isAdmin', () => {
  it('is false when user is null', () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });

    renderAuth();

    expect(AuthRef.latest.isAdmin).toBe(false);
  });

  it('is false when user email is not in the admin list', () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'u1', email: 'regular@example.com' });
      return () => {};
    });

    renderAuth();

    expect(AuthRef.latest.isAdmin).toBe(false);
  });

  it('is true when user email matches the configured admin email', () => {
    // The module uses the default admin email 'pooleadam25@gmail.com' in tests
    // because REACT_APP_ADMIN_EMAILS is not set in the test environment.
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'u1', email: 'pooleadam25@gmail.com' });
      return () => {};
    });

    renderAuth();

    expect(AuthRef.latest.isAdmin).toBe(true);
  });

  it('is case-insensitive for admin email comparison', () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'u1', email: 'POOLEADAM25@GMAIL.COM' });
      return () => {};
    });

    renderAuth();

    expect(AuthRef.latest.isAdmin).toBe(true);
  });

  it('is false when user has no email', () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'u1', email: null });
      return () => {};
    });

    renderAuth();

    expect(AuthRef.latest.isAdmin).toBe(false);
  });

  it('is false when user email is undefined', () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: 'u1' });
      return () => {};
    });

    renderAuth();

    expect(AuthRef.latest.isAdmin).toBe(false);
  });
});

describe('AuthProvider – logout', () => {
  it('calls Firebase signOut', async () => {
    mockOnAuthStateChanged.mockReturnValue(() => {});
    mockSignOut.mockResolvedValue(undefined);

    renderAuth();

    await act(async () => {
      await AuthRef.latest.logout();
    });

    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});

describe('AuthProvider – sendPasswordReset', () => {
  it('calls Firebase sendPasswordResetEmail with the provided email', async () => {
    mockOnAuthStateChanged.mockReturnValue(() => {});
    mockSendPasswordResetEmail.mockResolvedValue(undefined);

    renderAuth();

    await act(async () => {
      await AuthRef.latest.sendPasswordReset('user@example.com');
    });

    expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'user@example.com');
  });
});

describe('AuthProvider – updateDisplayName', () => {
  it('throws when there is no current user', async () => {
    mockOnAuthStateChanged.mockReturnValue(() => {});

    renderAuth();

    await expect(AuthRef.latest.updateDisplayName('Alice')).rejects.toThrow(
      'You must be signed in to update your profile.'
    );
  });
});

describe('useAuth', () => {
  it('throws when used outside AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    function BareConsumer() {
      useAuth();
      return null;
    }

    expect(() => render(<BareConsumer />)).toThrow('useAuth must be used inside <AuthProvider>');

    consoleError.mockRestore();
  });
});
