import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || 'pooleadam25@gmail.com')
  .split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ?? null);
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

  const isAdmin = Boolean(user?.email) && adminEmails.includes(String(user.email).toLowerCase());

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAdmin,
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
