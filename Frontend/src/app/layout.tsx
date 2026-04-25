import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthSync from '../components/AuthSync';
import AuthHeader from '../components/AuthHeader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MeetMind — Smart Meeting Assistant',
  description: 'AI meeting transcription, attention tracking, and automation for Google Meet, Zoom, and Teams',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <AuthSync />
          <AuthHeader />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}