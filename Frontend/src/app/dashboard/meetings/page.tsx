'use client';

import Link from 'next/link';
import { Calendar, Search, Filter, Plus, ArrowRight } from 'lucide-react';

const meetings = [
  { id: '1', title: 'Weekly Team Standup', date: 'Today, 10:00 AM', duration: '30 min', status: 'completed', platform: 'google-meet' },
  { id: '2', title: 'Product Roadmap Review', date: 'Yesterday, 2:00 PM', duration: '60 min', status: 'completed', platform: 'zoom' },
  { id: '3', title: '1:1 with Manager', date: 'Mar 20, 11:00 AM', duration: '30 min', status: 'completed', platform: 'teams' },
];

export default function MeetingsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meetings</h1>
          <p className="text-gray-600">View and manage all your meetings</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>New Meeting</span>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search meetings..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </button>
      </div>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="block p-6 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">{meeting.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{meeting.date}</span>
                  </span>
                  <span>{meeting.duration}</span>
                  <span className="capitalize">{meeting.platform.replace('-', ' ')}</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}