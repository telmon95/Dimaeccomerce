import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [resetNotice, setResetNotice] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleAuth = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setResetNotice(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    setResetNotice(null);

    if (mode === 'signup') {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        setIsSubmitting(false);
        return;
      }
      navigate('/');
      setIsSubmitting(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setError('Login failed. Please try again.');
      setIsSubmitting(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profileError && profile?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setResetNotice('Enter your email first, then try again.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setResetNotice(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setIsSubmitting(false);
      return;
    }

    setResetNotice('Password reset link sent. Check your email.');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 border border-border rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl mb-2">Welcome back</h1>
        <p className="text-muted-foreground mb-6">
          {mode === 'signup' ? 'Create your account to checkout' : 'Login to manage your store'}
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {resetNotice && <p className="text-sm text-muted-foreground">{resetNotice}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? mode === 'signup'
                ? 'Creating account...'
                : 'Signing in...'
              : mode === 'signup'
              ? 'Sign up'
              : 'Login'}
          </Button>
        </form>
        <div className="my-4 flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={handleGoogleAuth}>
          Continue with Google
        </Button>
        <div className="mt-4 text-sm text-muted-foreground text-center">
          {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className="text-primary underline"
            onClick={() => {
              setError(null);
              setResetNotice(null);
              setMode(mode === 'signup' ? 'login' : 'signup');
            }}
          >
            {mode === 'signup' ? 'Login' : 'Sign up'}
          </button>
        </div>
        {mode === 'login' && (
          <div className="mt-3 text-sm text-center">
            <button
              type="button"
              className="text-primary underline"
              onClick={handleResetPassword}
            >
              Forgot your password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
