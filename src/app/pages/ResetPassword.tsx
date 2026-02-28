import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (isMounted) {
        setReady(Boolean(data.session));
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    navigate('/login');
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/90 border border-border rounded-2xl p-8 text-center shadow-sm">
          <h1 className="text-xl mb-2">Check your email</h1>
          <p className="text-muted-foreground">
            Use the password reset link we sent to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 border border-border rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl mb-2">Reset password</h1>
        <p className="text-muted-foreground mb-6">Choose a new password for your account</p>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
