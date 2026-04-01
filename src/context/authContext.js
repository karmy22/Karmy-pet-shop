import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

async function fetchServerAuthStatus(firebaseUser) {
  const token = await firebaseUser.getIdToken();
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Unable to verify account status');
  }

  return response.json();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser ?? null);

      if (!firebaseUser) {
        setIsAdmin(false);
        setIsAdminLoading(false);
        return;
      }

      setIsAdminLoading(true);
      try {
        const status = await fetchServerAuthStatus(firebaseUser);
        setIsAdmin(Boolean(status?.isAdmin));
      } catch (error) {
        console.error(error);
        setIsAdmin(false);
      } finally {
        setIsAdminLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  const sendPasswordReset = (email) => sendPasswordResetEmail(auth, email);

  const updateDisplayName = async (displayName) => {
    if (!auth.currentUser) {
      throw new Error('You must be signed in to update your profile.');
    }

    await updateProfile(auth.currentUser, { displayName: displayName.trim() });
    setUser({ ...auth.currentUser });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAdmin,
        isAdminLoading,
        sendPasswordReset,
        updateDisplayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return ctx;
}
