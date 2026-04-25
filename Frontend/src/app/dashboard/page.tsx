'use client';

import Link from 'next/link';
import { Calendar, Users, CheckCircle, Link2, Plus, ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Total Meetings', value: '12', icon: Calendar, change: '+3 this month' },
  { label: 'Avg Attention', value: '78%', icon: Users, change: '+5%' },
  { label: 'Action Items', value: '28', icon: CheckCircle, change: '12 pending' },
  { label: 'Integrations', value: '6', icon: Link2, change: 'Active' },
];

const recentMeetings = [
  { id: '1', title: 'Weekly Team Standup', date: 'Today, 10:00 AM', status: 'completed', platform: 'google-meet' },
  { id: '2', title: 'Product Roadmap Review', date: 'Yesterday, 2:00 PM', status: 'completed', platform: 'zoom' },
  { id: '3', title: '1:1 with Manager', date: 'Mar 20, 11:00 AM', status: 'completed', platform: 'teams' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here&apos;s your meeting overview.</p>
        </div>
        <Link href="/dashboard/meetings" className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>New Meeting</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="p-6 border rounded-lg">
            <div className="flex items-center justify-between">
              <stat.icon className="h-5 w-5 text-gray-400" />
              <span className="text-xs text-green-500">{stat.change}</span>
            </div>
            <p className="text-3xl font-bold mt-4">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Meetings */}
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Recent Meetings</h2>
            <Link href="/dashboard/meetings" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentMeetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/dashboard/meetings/${meeting.id}`}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{meeting.title}</h3>
                  <p className="text-sm text-gray-600">{meeting.date}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Weekly Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mon</span>
              <div className="flex-1 mx-4 h-4 bg-gray-200 rounded">
                <div className="h-full w-3/4 bg-blue-600 rounded"></div>
              </div>
              <span className="text-sm">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tue</span>
              <div className="flex-1 mx-4 h-4 bg-gray-200 rounded">
                <div className="h-full w-1/2 bg-blue-600 rounded"></div>
              </div>
              <span className="text-sm">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Wed</span>
              <div className="flex-1 mx-4 h-4 bg-gray-200 rounded">
                <div className="h-full w-full bg-blue-600 rounded"></div>
              </div>
              <span className="text-sm">4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Thu</span>
              <div className="flex-1 mx-4 h-4 bg-gray-200 rounded">
                <div className="h-full w-1/4 bg-blue-600 rounded"></div>
              </div>
              <span className="text-sm">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fri</span>
              <div className="flex-1 mx-4 h-4 bg-gray-200 rounded">
                <div className="h-full w-1/2 bg-blue-600 rounded"></div>
              </div>
              <span className="text-sm">2</span>
            </div>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Integration Status</h2>
          <Link href="/dashboard/integrations" className="text-sm text-blue-600 hover:underline">
            Manage
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Notion', 'Slack', 'Gmail', 'Calendar'].map((app) => (
            <div key={app} className="flex items-center space-x-2 p-3 border rounded-lg">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">{app}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}