import type { Metadata } from 'next';

// ORIGINAL CODE (Clerk import)
// import { ClerkProvider } from '@clerk/nextjs';

import { ClerkProvider } from '@clerk/nextjs'; // keep import (needed if enabled later)

import { Manrope, Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

// ORIGINAL CODE
// import AuthSync from '../components/AuthSync';
// import AuthHeader from '../components/AuthHeader';

import AuthSync from '../components/AuthSync';
import AuthHeader from '../components/AuthHeader';

// Premium Typography System
// Using Space Grotesk as heading font (similar to General Sans/Cabinet Grotesk)
const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const manrope = Manrope({ 
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'MeetMind — Smart Meeting Assistant',
  description: 'AI meeting transcription, attention tracking, and automation for Google Meet, Zoom, and Teams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // 🔥 NEW CODE (Clerk fallback check — safe for local UI dev)
  const isClerkAvailable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable} ${plusJakarta.variable}`}>
      <body className="font-body antialiased">

        {/* ORIGINAL CODE (Clerk always enabled)
        <ClerkProvider>
          <AuthSync />
          <AuthHeader />
          {children}
        </ClerkProvider>
        */}

        {/* 🔥 NEW CODE (conditional Clerk wrapper) */}
        {isClerkAvailable ? (
          <ClerkProvider>
            {/* ORIGINAL COMPONENTS */}
            {/*<AuthSync />
            <AuthHeader />*/}
            {children}
          </ClerkProvider>
        ) : (
          <>
            {/* 🔥 FALLBACK MODE (no auth, UI only) */}
            {children}
          </>
        )}

      </body>
    </html>
  );
}