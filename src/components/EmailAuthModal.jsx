import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, redirectToLogin } from '@/lib/auth';

export default function EmailAuthModal({ open, onClose, forceLoginOnly = false }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const effectiveMode = forceLoginOnly ? 'signin' : mode;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (effectiveMode === 'signup') {
        await signUpWithEmail(email, password, fullName);
      } else {
        await signInWithEmail(email, password);
      }
      window.location.href = '/home';
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await redirectToLogin();
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #2563EB, #1E40AF, #3B82F6)" }} />

        <div className="p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 mb-1">
              {effectiveMode === 'signup' ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 text-sm">
              {effectiveMode === 'signup'
                ? 'Sign up to start learning AI the right way'
                : forceLoginOnly
                  ? 'Log in with the account you created on leamindai.com'
                  : 'Sign in to continue your AI journey'}
            </p>
          </div>

          {/* Google button — website only */}
          {!forceLoginOnly && (
            <>
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full h-12 bg-white border-2 border-slate-200 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-3 hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 border border-slate-100">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.71 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                Continue with Google
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-slate-400 text-xs font-bold tracking-widest">OR</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {effectiveMode === 'signup' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-blue-200/60"
              style={{ background: "linear-gradient(135deg, #2563EB, #1E40AF)" }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : effectiveMode === 'signup' ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {!forceLoginOnly && (
            <div className="mt-5 text-center">
              <button
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setError('');
                }}
                className="text-slate-500 hover:text-blue-600 text-sm font-medium transition-colors"
              >
                {mode === 'signup'
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          )}

          {forceLoginOnly && (
            <div className="mt-5 p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-blue-700 text-xs text-center leading-relaxed">
                Don't have an account yet?<br />
                Visit <span className="font-semibold">leamindai.com</span> to sign up.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}