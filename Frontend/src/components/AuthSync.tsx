'use client';

import { SignedIn, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

function SyncUser() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress || '',
          name: user.fullName || '',
          avatar: user.imageUrl || '',
        }),
      }).catch(console.error);
    }
  }, [user, isLoaded]);

  return null;
}

export default function AuthSync() {
  return (
    <SignedIn>
      <SyncUser />
    </SignedIn>
  );
}