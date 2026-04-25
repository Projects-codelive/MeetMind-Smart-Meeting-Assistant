'use client';

import { useAuth, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function AuthHeader() {
  const { userId } = useAuth();
  
  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16 border-b bg-white">
      {userId ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-gray-600 hover:text-blue-600">Login</Link>
          <Link href="/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}