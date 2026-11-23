import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Btn } from './Button';
import { Modal } from './Modal';
import { useToast } from './Toast';
import { DEMO } from '../data/demoData';
import { readAcc, readPlan, saveAcc } from '../utils/storage';
import { EMAIL, PWL, pwScore } from '../utils/validation';

export default function AuthForm({ mode, go, signIn }) {
  const isSignUp = mode === 'signup';
  const toast = useToast();

  const [formValues, setFormValues] = useState({
    name: '',
    email: isSignUp ? '' : 'noorulhuda@orvexa.dev',
    pw: isSignUp ? '' : 'orvexapro2026',
    ok: false,
  });

  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const handleChange = (field) => (e) => {
    setFormValues({ ...formValues, [field]: e.target.value });
    if (errors[field] || errors.form) {
      setErrors({ ...errors, [field]: '', form: '' });
    }
  };

  const score = pwScore(formValues.pw);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailClean = formValues.email.trim().toLowerCase();

    if (isSignUp && !formValues.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }
    if (!EMAIL.test(emailClean)) {
      newErrors.email = 'Please enter a valid work email address.';
    }
    if (formValues.pw.length < 8) {
      newErrors.pw = 'Password must be at least 8 characters.';
    }
    if (isSignUp && !formValues.ok) {
      newErrors.ok = 'Please accept the Terms of Service to continue.';
    }

    const accounts = readAcc();
    const existing = accounts.find((a) => a.email === emailClean);

    if (!Object.keys(newErrors).length) {
      if (isSignUp && existing) {
        newErrors.email = 'An account with this email already exists. Please sign in instead.';
      }
      if (!isSignUp && !existing) {
        newErrors.form = 'No account found with this email. Click "Continue as Noor-Ul-Huda" below or sign up.';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length) {
      toast('Please correct the highlighted fields.', 'err');
      return;
    }

    setBusy(true);
    setTimeout(() => {
      if (isSignUp) {
        const newUser = {
          name: formValues.name.trim(),
          email: emailClean,
          plan: readPlan() || 'Pro',
        };
        saveAcc([...accounts, newUser]);
        signIn(newUser);
      } else {
        signIn(existing || DEMO);
      }
    }, 450);
  };

  return (
    <div className="nx-auth-form-card">
      {/* Card Header */}
      <div className="nx-auth-card-head">
        <h1>{isSignUp ? 'Create your workspace' : 'Welcome back to Orvexa'}</h1>
        <p className="nx-auth-card-subtitle">
          {isSignUp
            ? 'Start orchestrating autonomous workflows in under two minutes.'
            : 'Enter your credentials to access your workspace and pipelines.'}
        </p>
      </div>

      {/* Prominent One-Click Demo Access Button */}
      <div className="nx-demo-access-box">
        <motion.button
          type="button"
          className="nx-demo-btn"
          whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(112, 71, 235, 0.15)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            toast('Signing in with demo workspace credentials...');
            signIn(DEMO);
          }}
        >
          <div className="nx-demo-btn-left">
            <span className="nx-demo-avatar">NH</span>
            <div>
              <strong>Continue as Noor-Ul-Huda</strong>
              <span>Lead DevOps · Pro Workspace</span>
            </div>
          </div>
          <span className="nx-demo-badge">1-Click Demo →</span>
        </motion.button>
      </div>

      <div className="nx-auth-divider">
        <span>OR WORKSPACE EMAIL</span>
      </div>

      <form onSubmit={handleSubmit} noValidate className="nx-auth-form">
        {isSignUp && (
          <div className="nx-form-group">
            <label className="nx-form-label" htmlFor="auth-name">
              Full Name
            </label>
            <input
              id="auth-name"
              type="text"
              className={`nx-form-input ${errors.name ? 'has-error' : ''}`}
              placeholder="e.g. Alex Mercer"
              value={formValues.name}
              onChange={handleChange('name')}
              autoComplete="name"
            />
            <AnimatePresence>
              {errors.name && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="nx-form-error"
                >
                  {errors.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="nx-form-group">
          <label className="nx-form-label" htmlFor="auth-email">
            Work Email Address
          </label>
          <input
            id="auth-email"
            type="email"
            className={`nx-form-input ${errors.email ? 'has-error' : ''}`}
            placeholder="name@company.com"
            value={formValues.email}
            onChange={handleChange('email')}
            autoComplete="email"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="nx-form-error"
              >
                {errors.email}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="nx-form-group">
          <div className="nx-form-label-row">
            <label className="nx-form-label" htmlFor="auth-pw">
              Password
            </label>
            {!isSignUp && (
              <button
                type="button"
                className="nx-forgot-link"
                onClick={() => {
                  setForgotEmail(formValues.email);
                  setShowForgot(true);
                }}
              >
                Forgot password?
              </button>
            )}
          </div>
          <div className="nx-password-wrap">
            <input
              id="auth-pw"
              type={showPw ? 'text' : 'password'}
              className={`nx-form-input ${errors.pw ? 'has-error' : ''}`}
              placeholder="••••••••••••"
              value={formValues.pw}
              onChange={handleChange('pw')}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              className="nx-pw-toggle-btn"
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              <motion.div
                key={showPw ? 'hide' : 'show'}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: 'flex' }}
              >
                {showPw ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>
          <AnimatePresence>
            {errors.pw && (
              <motion.span
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="nx-form-error"
              >
                {errors.pw}
              </motion.span>
            )}
          </AnimatePresence>
          {isSignUp && formValues.pw && (
            <div className="nx-pw-strength-row">
              <div className="nx-pw-bars">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`nx-pw-bar-step ${score >= step ? 'filled' : ''} score-${score}`}
                  />
                ))}
              </div>
              <span className="nx-pw-strength-label">
                Strength: {PWL[score] || 'Too short'}
              </span>
            </div>
          )}
        </div>

        {isSignUp && (
          <div className="nx-form-group">
            <label className="nx-checkbox-label">
              <input
                type="checkbox"
                checked={formValues.ok}
                onChange={(e) => {
                  setFormValues({ ...formValues, ok: e.target.checked });
                  if (errors.ok) setErrors({ ...errors, ok: '' });
                }}
                className="nx-checkbox"
              />
              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>
            <AnimatePresence>
              {errors.ok && (
                <motion.span
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="nx-form-error"
                >
                  {errors.ok}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}

        <AnimatePresence>
          {errors.form && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              className="nx-form-banner-error"
            >
              {errors.form}
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <motion.button
            type="submit"
            disabled={busy}
            className="btn pri full nx-auth-submit-btn"
            whileHover={!busy ? { y: -1, boxShadow: '0 6px 20px rgba(112, 71, 235, 0.35)' } : {}}
            whileTap={!busy ? { scale: 0.98 } : {}}
          >
            {busy ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <motion.span
                  style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: '#FFFFFF',
                    borderRadius: '50%',
                    display: 'inline-block',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                />
                {isSignUp ? 'Creating Workspace…' : 'Signing In…'}
              </span>
            ) : isSignUp ? (
              'Create Workspace →'
            ) : (
              'Sign in to Workspace →'
            )}
          </motion.button>
        </div>
      </form>

      {/* Switch mode link */}
      <div className="nx-auth-card-footer">
        {isSignUp ? (
          <p>
            Already have a workspace?{' '}
            <button
              type="button"
              className="nx-inline-link"
              onClick={() => go('signin')}
            >
              Sign in →
            </button>
          </p>
        ) : (
          <p>
            Don't have a workspace?{' '}
            <button
              type="button"
              className="nx-inline-link"
              onClick={() => go('signup')}
            >
              Sign up free →
            </button>
          </p>
        )}
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <Modal title="Reset Password" onClose={() => setShowForgot(false)}>
          <p className="note" style={{ marginTop: 0, marginBottom: 16 }}>
            Enter your work email address to receive secure password reset instructions.
          </p>
          <div className="nx-form-group">
            <label className="nx-form-label" htmlFor="forgot-email">
              Work Email
            </label>
            <input
              id="forgot-email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="nx-form-input"
              placeholder="name@company.com"
            />
          </div>
          <div className="cta" style={{ marginTop: 20 }}>
            <Btn
              onClick={() => {
                if (!EMAIL.test(forgotEmail.trim())) {
                  toast('Please enter a valid email address.', 'err');
                  return;
                }
                setShowForgot(false);
                toast(`Password reset instructions sent to ${forgotEmail.trim()}`);
              }}
            >
              Send Reset Link
            </Btn>
            <Btn v="sec" onClick={() => setShowForgot(false)}>
              Cancel
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export { AuthForm };
