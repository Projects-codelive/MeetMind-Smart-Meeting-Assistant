'use client';

import Link from 'next/link';
import { Mic, Brain, Link2, BarChart3, Calendar, Zap, MessageSquare, Languages, Clock, Users, DollarSign, Shield, Check } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const features = [
  { icon: Mic, title: 'Live Transcription', description: 'Multi-speaker transcription with speaker diarization' },
  { icon: Brain, title: 'AI Summaries', description: 'Auto-generated summaries and action items' },
  { icon: Users, title: 'Attention Tracking', description: 'Track engagement with webcam-based CV' },
  { icon: Link2, title: '9 Integrations', description: 'Notion, Slack, Jira, Gmail, and more' },
  { icon: MessageSquare, title: 'AI Q&A', description: 'Ask questions on any past meeting' },
  { icon: Languages, title: 'Multi-language', description: '90+ languages supported' },
  { icon: Clock, title: 'Late Joiner Catch-up', description: 'Instant summary for late arrivals' },
  { icon: BarChart3, title: 'Analytics', description: 'Speaking time and engagement metrics' },
  { icon: Calendar, title: 'Auto-schedule', description: 'Book follow-up meetings automatically' },
  { icon: DollarSign, title: 'Meeting Costs', description: 'Track meeting ROI' },
  { icon: Zap, title: 'Pre-briefing', description: '5-minute prep before meetings' },
  { icon: Shield, title: 'Privacy First', description: 'No bots, all consent-based' }
];

const integrations = [
  { name: 'Notion', description: 'Auto-creates meeting pages with tasks' },
  { name: 'Slack', description: 'Posts summaries and DMs action items' },
  { name: 'Jira', description: 'Creates tickets from action items' },
  { name: 'Gmail', description: 'Sends follow-up emails' },
  { name: 'Google Calendar', description: 'Books follow-up meetings' },
  { name: 'GitHub', description: 'Creates issues from tech discussions' },
  { name: 'Salesforce', description: 'Updates CRM records' },
  { name: 'Asana', description: 'Creates task cards' },
  { name: 'Google Drive', description: 'Saves recordings and transcripts' }
];

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  if (isLoaded && isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">MeetMind</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600">Features</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600">How It Works</Link>
              <Link href="#integrations" className="text-gray-600 hover:text-blue-600">Integrations</Link>
              <Link href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
            Your meetings run themselves.
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            MeetMind transcribes, summarizes, tracks attention, and automates every follow-up 
            across Notion, Slack, Jira, Gmail and 6 more tools.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700">
              Get Started — Free
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Works on Google Meet • Zoom • MS Teams
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. You join your meeting</h3>
              <p className="text-gray-600">Extension activates automatically when you open Google Meet, Zoom, or Teams</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI does the work</h3>
              <p className="text-gray-600">Real-time transcription, attention tracking, and note-taking</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Everything updates</h3>
              <p className="text-gray-600">Notion, Slack, Jira all update instantly after the meeting</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything you need for better meetings</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <feature.icon className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Automate across your tools</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center p-4 border rounded-lg">
                <Check className="h-5 w-5 text-green-500 mr-4" />
                <div>
                  <h3 className="font-semibold">{integration.name}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="border rounded-lg p-8">
              <h3 className="text-xl font-semibold">Free</h3>
              <p className="text-3xl font-bold mt-4">$0<span className="text-sm font-normal">/month</span></p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2" />10 meetings/month</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2" />Basic transcription</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2" />2 integrations</li>
              </ul>
              <Link href="/dashboard" className="mt-8 block text-center border py-2 rounded-md hover:bg-gray-50">
                Get Started
              </Link>
            </div>
            <div className="border-2 border-blue-600 rounded-lg p-8">
              <h3 className="text-xl font-semibold">Pro</h3>
              <p className="text-3xl font-bold mt-4">$12<span className="text-sm font-normal">/month</span></p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2" />Unlimited meetings</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2" />All integrations</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2" />Attention tracking</li>
              </ul>
              <Link href="/dashboard" className="mt-8 block text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                Get Started
              </Link>
            </div>
            <div className="border rounded-lg p-8">
              <h3 className="text-xl font-semibold">Enterprise</h3>
              <p className="text-3xl font-bold mt-4">Custom</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center"><Check className="h-4 w-4 mr-2" />SSO</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2" />Admin controls</li>
                <li className="flex items-center"><Check className="h-4 w-4 mr-2" />Custom integrations</li>
              </ul>
              <button className="mt-8 w-full border py-2 rounded-md hover:bg-gray-50">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6" />
              <span className="font-semibold">MeetMind</span>
            </div>
            <p className="text-sm text-gray-500">© 2024 MeetMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}