'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Card } from '@/components/ui/card';
import { useSupabase } from '@/app/providers';

interface User {
  name: string;
  email: string;
}

export default function WelcomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = useSupabase();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) {
          router.push('/auth/signin');
          return;
        }

        // Get user details
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('name, email')
          .eq('id', session.user.id)
          .single();

        if (customerError) throw customerError;

        setUser(customer);
      } catch (error) {
        console.error('Error fetching user:', error);
        router.push('/auth/error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-semibold">
          Welcome, {user.name}! 👋
        </h1>

        <p className="mb-4 text-muted-foreground">
          Thank you for creating an account. We're excited to help you manage your support requests.
        </p>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">What's Next?</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Browse our knowledge base for quick answers</li>
            <li>Create your first support ticket</li>
            <li>Complete your profile settings</li>
          </ul>
        </div>

        <div className="mt-8 space-x-4">
          <Button onClick={() => router.push('/portal/dashboard')}>
            Go to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/portal/profile')}
          >
            Complete Profile
          </Button>
        </div>
      </Card>
    </div>
  );
} 