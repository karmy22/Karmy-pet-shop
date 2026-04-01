import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import Navbar from '../components/navbar';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/account';
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingPostalCode, setShippingPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const clearError = () => setError('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (!name.trim()) { setError('Please enter your name.'); setLoading(false); return; }
        if (!shippingAddress.trim() || !shippingCity.trim() || !shippingState.trim() || !shippingPostalCode.trim()) {
          setError('Please provide your shipping address details.');
          setLoading(false);
          return;
        }
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, {
          displayName: name.trim(),
        });
        localStorage.setItem(`karmy-profile-${credential.user.uid}`, JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          shippingAddress: shippingAddress.trim(),
          shippingCity: shippingCity.trim(),
          shippingState: shippingState.trim(),
          shippingPostalCode: shippingPostalCode.trim(),
          phone: phone.trim(),
        }));
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(friendlyMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    clearError();
    try {
      await signInWithPopup(auth, googleProvider);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(friendlyMessage(err.code));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', flexDirection: 'column', fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 6%' }}>
        <div style={{ width: '100%', maxWidth: 430, background: 'rgba(255,255,255,.94)', border: '1px solid rgba(74,124,138,.2)', borderRadius: 16, padding: '36px 32px', boxShadow: '0 18px 40px rgba(74,124,138,.12)' }}>
          <div style={{ display: 'flex', background: 'var(--cream)', borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); clearError(); }}
                style={{
                  flex: 1, border: 'none', borderRadius: 9, padding: '9px 0',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '.88rem', cursor: 'pointer',
                  background: mode === m ? 'var(--white)' : 'transparent',
                  color: mode === m ? 'var(--ink)' : 'var(--mid)',
                  boxShadow: mode === m ? '0 2px 8px rgba(74,124,138,.12)' : 'none',
                  transition: 'all .2s',
                }}
              >
                {m === 'login' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 6, fontFamily: "'Cormorant Garamond', serif" }}>
            {mode === 'login' ? 'Welcome back' : 'Join Karmy'}
          </h1>
          <p style={{ color: 'var(--mid)', fontSize: '.9rem', marginBottom: 24 }}>
            {mode === 'login' ? 'Sign in to your account to continue.' : 'Create an account with shipping details to start checkout faster.'}
          </p>

          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              border: '1.5px solid var(--mist)', borderRadius: 10, padding: '12px 0',
              background: 'var(--white)', fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: '.95rem', color: 'var(--ink)', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? .6 : 1, transition: 'border-color .2s',
              marginBottom: 20,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = 'var(--teal)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--mist)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--mist)' }} />
            <span style={{ color: 'var(--mid)', fontSize: '.8rem' }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--mist)' }} />
          </div>

          <form onSubmit={handleEmailAuth} noValidate>
            {mode === 'register' && (
              <>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '.85rem' }}>Full name</label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Jane Smith"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--teal)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--mist)'; }}
                />

                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '.85rem' }}>Shipping address</label>
                <input
                  type="text"
                  required
                  autoComplete="street-address"
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  placeholder="123 Main St"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--teal)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--mist)'; }}
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '.85rem' }}>City</label>
                    <input
                      type="text"
                      required
                      autoComplete="address-level2"
                      value={shippingCity}
                      onChange={e => setShippingCity(e.target.value)}
                      placeholder="City"
                      style={{ ...inputStyle, marginBottom: 12 }}
                      onFocus={e => { e.target.style.borderColor = 'var(--teal)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--mist)'; }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '.85rem' }}>State</label>
                    <input
                      type="text"
                      required
                      autoComplete="address-level1"
                      value={shippingState}
                      onChange={e => setShippingState(e.target.value)}
                      placeholder="State"
                      style={{ ...inputStyle, marginBottom: 12 }}
                      onFocus={e => { e.target.style.borderColor = 'var(--teal)'; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--mist)'; }}
                    />
                  </div>
                </div>

                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '.85rem' }}>Postal code</label>
                <input
                  type="text"
                  required
                  autoComplete="postal-code"
                  value={shippingPostalCode}
                  onChange={e => setShippingPostalCode(e.target.value)}
                  placeholder="Postal code"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--teal)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--mist)'; }}
                />

                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '.85rem' }}>Phone (optional)</label>
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(555) 555-5555"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--teal)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--mist)'; }}
                />
              </>
            )}
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '.85rem' }}>Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
              onFocus={e => { e.target.style.borderColor = 'var(--teal)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--mist)'; }}
            />

            <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '.85rem' }}>Password</label>
            <input
              type="password"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={mode === 'register' ? 'At least 6 characters' : '••••••••'}
              style={{ ...inputStyle, marginBottom: 22 }}
              onFocus={e => { e.target.style.borderColor = 'var(--teal)'; }}
              onBlur={e => { e.target.style.borderColor = 'var(--mist)'; }}
            />

            {mode === 'login' && (
              <div style={{ marginTop: -10, marginBottom: 16 }}>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: '.82rem', color: 'var(--ink)', fontWeight: 600, textDecoration: 'none' }}
                >
                  Forgot password?
                </Link>
              </div>
            )}

            {error && (
              <div style={{ background: '#fff0f0', border: '1px solid #f5c6c6', borderRadius: 10, padding: '10px 14px', color: '#c0392b', fontSize: '.85rem', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', border: 'none', borderRadius: 10, padding: '13px 0',
                background: 'var(--ink)', color: 'var(--white)', fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? .7 : 1, transition: 'background .2s',
              }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', marginBottom: 16, padding: '12px 14px',
  border: '1.5px solid var(--mist)', borderRadius: 12, fontSize: '.95rem',
  fontFamily: "'DM Sans', sans-serif", color: 'var(--ink)', background: 'var(--surface)',
  outline: 'none', display: 'block',
};

function friendlyMessage(code) {
  const map = {
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password — please try again.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/email-already-in-use': 'An account already exists with that email.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/too-many-requests': 'Too many attempts — please wait a moment and try again.',
    'auth/network-request-failed': 'Network error — check your connection.',
  };
  return map[code] ?? 'Something went wrong. Please try again.';
}
