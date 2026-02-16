import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 6

function validateEmail(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return 'Email is required'
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address'
  return null
}

function validatePassword(value: string, _isSignUp: boolean): string | null {
  if (!value) return 'Password is required'
  if (value.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  return null
}

function getRecoveryFromHash(): boolean {
  if (typeof window === 'undefined') return false
  const hash = window.location.hash
  if (!hash) return false
  const params = new URLSearchParams(hash.slice(1))
  return params.get('type') === 'recovery'
}

export function LoginPage() {
  const { user, loading, signInWithEmail, signUpWithEmail, resetPasswordForEmail, updatePassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: { pathname: string }; signedOut?: boolean } }
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false, passwordConfirm: false })
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [recoveryMode, setRecoveryMode] = useState(getRecoveryFromHash)
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [newPasswordTouched, setNewPasswordTouched] = useState(false)
  const signedOut = location.state?.signedOut === true

  const emailError = touched.email ? validateEmail(email) : null
  const passwordError = touched.password ? validatePassword(password, isSignUp) : null
  const passwordConfirmError =
    touched.passwordConfirm && password !== passwordConfirm
      ? 'Passwords do not match.'
      : touched.passwordConfirm && !passwordConfirm
        ? 'Confirm your password.'
        : null

  const canSubmitSignIn =
    email.trim() !== '' &&
    password !== '' &&
    !validateEmail(email.trim()) &&
    !validatePassword(password, false)

  const canSubmitSignUp =
    email.trim() !== '' &&
    password !== '' &&
    passwordConfirm !== '' &&
    !validateEmail(email.trim()) &&
    !validatePassword(password, true) &&
    password === passwordConfirm

  const canSubmit = isSignUp ? canSubmitSignUp : canSubmitSignIn

  const canSubmitReset = email.trim() !== '' && !validateEmail(email.trim())

  const newPasswordError = newPasswordTouched ? validatePassword(newPassword, true) : null
  const canSubmitNewPassword =
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    newPassword === newPasswordConfirm &&
    !newPasswordError

  useEffect(() => {
    if (user && !loading && !recoveryMode) {
      const from = location.state?.from?.pathname ?? '/'
      navigate(from, { replace: true })
    }
  }, [user, loading, navigate, location.state, recoveryMode])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setSignUpSuccess(false)
    setTouched({ email: true, password: true, passwordConfirm: true })

    const eErr = validateEmail(email.trim())
    const pErr = validatePassword(password, isSignUp)
    if (eErr || pErr) return
    if (isSignUp && password !== passwordConfirm) return

    setSubmitting(true)
    try {
      const trimmedEmail = email.trim()
      if (isSignUp) {
        await signUpWithEmail(trimmedEmail, password)
        setSubmitError(null)
        setSignUpSuccess(true)
      } else {
        await signInWithEmail(trimmedEmail, password)
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      const message =
        raw === 'Invalid login credentials'
          ? 'Invalid email or password. Please try again.'
          : raw.includes('Email not confirmed')
            ? 'Please confirm your email using the link we sent you.'
            : raw
      setSubmitError(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setTouched({ email: true, password: false, passwordConfirm: false })
    const eErr = validateEmail(email.trim())
    if (eErr) return
    setSubmitting(true)
    try {
      await resetPasswordForEmail(email.trim())
      setResetSuccess(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSetNewPassword(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!canSubmitNewPassword) return
    setSubmitting(true)
    try {
      await updatePassword(newPassword)
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
      setRecoveryMode(false)
      setNewPassword('')
      setNewPasswordConfirm('')
      setResetSuccess(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (recoveryMode) {
    return (
      <div className="login-page">
        <div className="login-bg" aria-hidden="true" />
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-icon">N</div>
            <span>Nexus Inventory</span>
          </div>
          <h1 className="login-title">Set new password</h1>
          <p className="login-subtitle">Enter your new password below.</p>
          {resetSuccess ? (
            <div className="login-message login-message-success" role="status">
              Your password has been updated. You can now sign in.
            </div>
          ) : (
            <form onSubmit={handleSetNewPassword} className="login-form" noValidate>
              <div className="form-field">
                <label htmlFor="login-new-password" className="form-label">New password</label>
                <input
                  id="login-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setSubmitError(null) }}
                  onBlur={() => setNewPasswordTouched(true)}
                  autoComplete="new-password"
                  className={newPasswordError ? 'form-input form-input-error' : 'form-input'}
                  placeholder="At least 6 characters"
                  minLength={MIN_PASSWORD_LENGTH}
                />
                <span className="form-help">At least {MIN_PASSWORD_LENGTH} characters.</span>
                {newPasswordError && (
                  <span className="form-field-error" role="alert">{newPasswordError}</span>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="login-new-password-confirm" className="form-label">Confirm password</label>
                <input
                  id="login-new-password-confirm"
                  type="password"
                  value={newPasswordConfirm}
                  onChange={(e) => { setNewPasswordConfirm(e.target.value); setSubmitError(null) }}
                  autoComplete="new-password"
                  className={newPasswordConfirm && newPassword !== newPasswordConfirm ? 'form-input form-input-error' : 'form-input'}
                  placeholder="Repeat password"
                  minLength={MIN_PASSWORD_LENGTH}
                />
                {newPasswordConfirm && newPassword !== newPasswordConfirm && (
                  <span className="form-field-error" role="alert">Passwords do not match.</span>
                )}
              </div>
              {submitError && <div className="form-error" role="alert">{submitError}</div>}
              <button
                type="submit"
                className="btn btn-primary login-submit"
                disabled={submitting || !canSubmitNewPassword}
              >
                {submitting ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
          <div className="login-switch login-switch-centered">
            <button
              type="button"
              className="btn btn-ghost login-switch-btn"
              onClick={() => {
                window.history.replaceState(null, '', window.location.pathname)
                setRecoveryMode(false)
                setResetSuccess(false)
              }}
            >
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (resetMode) {
    return (
      <div className="login-page">
        <div className="login-bg" aria-hidden="true" />
        <div className="login-card">
          <div className="login-logo">
            <div className="logo-icon">N</div>
            <span>Nexus Inventory</span>
          </div>
          <h1 className="login-title">Reset password</h1>
          <p className="login-subtitle">Enter your email and we’ll send you a link to reset your password.</p>
          {resetSuccess ? (
            <>
              <div className="login-message login-message-success" role="status">
                Check your email for a link to reset your password. If you don’t see it, check your spam folder.
              </div>
              <div className="login-switch login-switch-centered">
                <button
                  type="button"
                  className="btn btn-ghost login-switch-btn"
                  onClick={() => { setResetMode(false); setResetSuccess(false) }}
                >
                  Back to sign in
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleRequestReset} className="login-form" noValidate>
              <div className="form-field">
                <label htmlFor="login-reset-email" className="form-label">Email</label>
                <input
                  id="login-reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSubmitError(null) }}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  autoComplete="email"
                  className={`form-input ${emailError ? 'form-input-error' : ''}`}
                  placeholder="you@example.com"
                />
                {emailError && <span className="form-field-error" role="alert">{emailError}</span>}
              </div>
              {submitError && <div className="form-error" role="alert">{submitError}</div>}
              <button
                type="submit"
                className="btn btn-primary login-submit"
                disabled={submitting || !canSubmitReset}
              >
                {submitting ? 'Sending…' : 'Send reset link'}
              </button>
              <div className="login-switch login-switch-centered">
                <button
                  type="button"
                  className="btn btn-ghost login-switch-btn"
                  onClick={() => { setResetMode(false); setSubmitError(null) }}
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-bg" aria-hidden="true" />
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-icon">N</div>
          <span>Nexus Inventory</span>
        </div>
        <h1 className="login-title">{isSignUp ? 'Create account' : 'Welcome back'}</h1>
        <p className="login-subtitle">
          {isSignUp
            ? 'Enter your details to get started.'
            : 'Sign in to manage your inventory and stock.'}
        </p>
        {signedOut && (
          <div className="login-message login-message-info" role="status">
            You have been signed out.
          </div>
        )}
        {signUpSuccess && (
          <div className="login-message login-message-success" role="status">
            Check your email to confirm your account, then sign in.
          </div>
        )}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-field">
            <label htmlFor="login-email" className="form-label">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setSubmitError(null)
              }}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              autoComplete="email"
              className={`form-input ${emailError ? 'form-input-error' : ''}`}
              placeholder="you@example.com"
              aria-invalid={!!emailError}
              aria-describedby={emailError ? 'login-email-error' : undefined}
            />
            {emailError && (
              <span id="login-email-error" className="form-field-error" role="alert">
                {emailError}
              </span>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="login-password" className="form-label">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setSubmitError(null)
              }}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className={`form-input ${passwordError ? 'form-input-error' : ''}`}
              placeholder={isSignUp ? 'At least 6 characters' : '••••••••'}
              minLength={MIN_PASSWORD_LENGTH}
              aria-invalid={!!passwordError}
              aria-describedby={passwordError ? 'login-password-error' : undefined}
            />
            {isSignUp && <span className="form-help">At least {MIN_PASSWORD_LENGTH} characters.</span>}
            {passwordError && (
              <span id="login-password-error" className="form-field-error" role="alert">
                {passwordError}
              </span>
            )}
          </div>
          {isSignUp && (
            <div className="form-field">
              <label htmlFor="login-password-confirm" className="form-label">
                Confirm password
              </label>
              <input
                id="login-password-confirm"
                type="password"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value)
                  setSubmitError(null)
                }}
                onBlur={() => setTouched((t) => ({ ...t, passwordConfirm: true }))}
                autoComplete="new-password"
                className={`form-input ${passwordConfirmError ? 'form-input-error' : ''}`}
                placeholder="Repeat password"
                minLength={MIN_PASSWORD_LENGTH}
                aria-invalid={!!passwordConfirmError}
              />
              {passwordConfirmError && (
                <span className="form-field-error" role="alert">{passwordConfirmError}</span>
              )}
            </div>
          )}
          {submitError && (
            <div className="form-error" role="alert">
              {submitError}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading || submitting || !canSubmit}
          >
            {submitting ? 'Please wait…' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>
        <div className="login-switch login-switch-centered">
          {!isSignUp && (
            <button
              type="button"
              className="btn btn-ghost login-switch-link"
              onClick={() => { setResetMode(true); setSubmitError(null) }}
            >
              Forgot password?
            </button>
          )}
          <p className="login-switch-text">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              className="btn btn-ghost login-switch-btn"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setSubmitError(null)
                setSignUpSuccess(false)
                setPasswordConfirm('')
                setTouched({ email: false, password: false, passwordConfirm: false })
              }}
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
