import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Checkbox } from '../components/Checkbox';
import { Link } from '../components/Link';
import { Alert } from '../components/Alert';
import styles from './LoginScreen.module.css';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onForgotPassword,
  onSignUp,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.backgroundGradient} />
        <div className={styles.backgroundPattern} />
      </div>

      <div className={styles.content}>
        <Card variant="elevated" className={styles.loginCard}>
          <div className={styles.header}>
            <img
              src="/logo.svg"
              alt="Company Logo"
              className={styles.logo}
            />
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <Alert variant="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Input
              type="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-label="Email Address"
            />

            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              aria-label="Password"
            />

            <div className={styles.options}>
              <Checkbox
                checked={rememberMe}
                onChange={setRememberMe}
                label="Remember me"
              />
              <Link onClick={onForgotPassword} variant="text">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
              disabled={!email || !password}
            >
              Sign In
            </Button>

            <div className={styles.divider}>
              <span className={styles.dividerText}>or continue with</span>
            </div>

            <div className={styles.socialButtons}>
              <Button
                variant="tertiary"
                size="medium"
                icon={<GoogleIcon />}
                onClick={() => {}}
              >
                Google
              </Button>
              <Button
                variant="tertiary"
                size="medium"
                icon={<AppleIcon />}
                onClick={() => {}}
              >
                Apple
              </Button>
              <Button
                variant="tertiary"
                size="medium"
                icon={<MicrosoftIcon />}
                onClick={() => {}}
              >
                Microsoft
              </Button>
            </div>
          </form>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Don't have an account?{' '}
              <Link onClick={onSignUp} variant="primary">
                Sign up
              </Link>
            </p>
          </div>
        </Card>

        <div className={styles.legal}>
          <Link href="/terms" variant="text" size="small">
            Terms of Service
          </Link>
          <span className={styles.separator}>•</span>
          <Link href="/privacy" variant="text" size="small">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

// Icon Components
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
      fill="#4285F4"
    />
    <path
      d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
      fill="#34A853"
    />
    <path
      d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.387 3.14 1.064 4.49l3.34-2.59z"
      fill="#FBBC05"
    />
    <path
      d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.191 5.737 7.396 3.977 10 3.977z"
      fill="#EA4335"
    />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path d="M15.765 6.864c-.126.096-2.347 1.35-2.347 4.134 0 3.222 2.826 4.362 2.91 4.392-.012.072-.45 1.554-1.494 3.072-.918 1.326-1.872 2.646-3.354 2.646-1.482 0-1.854-.864-3.516-.864-1.632 0-2.214.894-3.546.894-1.332 0-2.31-1.224-3.402-2.736C-.294 16.254-.996 13.434-.996 10.764c0-4.254 2.766-6.51 5.484-6.51 1.446 0 2.652.948 3.558.948.87 0 2.226-1.002 3.876-1.002.624 0 2.874.06 4.356 2.166l-.513.498zm-2.55-3.978c.684-.828 1.164-1.968 1.164-3.114 0-.16-.012-.318-.036-.45-.114.012-.732.048-1.518.51a5.468 5.468 0 00-1.23 1.566 4.776 4.776 0 00-1.194 3.018c0 .174.03.348.036.402.06.012.156.024.252.024.642 0 1.824-.426 2.526-1.956z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path fill="#F25022" d="M0 0h9.5v9.5H0z"/>
    <path fill="#7FBA00" d="M10.5 0H20v9.5h-9.5z"/>
    <path fill="#00A4EF" d="M0 10.5h9.5V20H0z"/>
    <path fill="#FFB900" d="M10.5 10.5H20V20h-9.5z"/>
  </svg>
);