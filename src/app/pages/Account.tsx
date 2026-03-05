import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';

export default function Account() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        navigate('/login');
        return;
      }
      if (isMounted) {
        setEmail(data.user.email ?? null);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleDeleteAccount = async () => {
    if (isDeleting) return;
    const confirmed = window.confirm(
      'This will remove your account data and orders. Continue?'
    );
    if (!confirmed) return;

    setIsDeleting(true);
    setMessage(null);

    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) {
      setMessage('Unable to verify your account. Please log in again.');
      setIsDeleting(false);
      return;
    }

    await supabase.from('orders').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('id', userId);
    await supabase.from('deletion_requests').insert({ user_id: userId });

    await supabase.auth.signOut();
    setIsDeleting(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf6f0] to-white">
      <section className="bg-gradient-to-r from-[#b89573] to-[#8f6f55] text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl">Account</h1>
          <p className="text-sm sm:text-base text-purple-100 mt-2">
            Manage your profile and data
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-2xl space-y-6">
        <div className="bg-white/90 border border-border rounded-2xl p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="text-lg text-foreground">{email ?? 'Unknown'}</p>
        </div>

        <div className="bg-white/90 border border-border rounded-2xl p-6 shadow-sm space-y-3">
          <h2 className="text-lg text-foreground">Delete account</h2>
          <p className="text-sm text-muted-foreground">
            This removes your profile and order history. For compliance, we keep a minimal record of the
            deletion request.
          </p>
          {message && <p className="text-sm text-destructive">{message}</p>}
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete my account'}
          </Button>
        </div>
      </main>
    </div>
  );
}
