'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const attentionData = [
  { name: 'Mon', score: 85 },
  { name: 'Tue', score: 78 },
  { name: 'Wed', score: 92 },
  { name: 'Thu', score: 88 },
  { name: 'Fri', score: 75 },
];

const speakingData = [
  { name: 'You', time: 45 },
  { name: 'John', time: 30 },
  { name: 'Jane', time: 25 },
];

const COLORS = ['#2563eb', '#16a34a', '#eab308'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-600">Track your meeting performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 border rounded-lg">
          <p className="text-3xl font-bold">12</p>
          <p className="text-sm text-gray-600">Total Meetings</p>
        </div>
        <div className="p-6 border rounded-lg">
          <p className="text-3xl font-bold">83%</p>
          <p className="text-sm text-gray-600">Avg Attention</p>
        </div>
        <div className="p-6 border rounded-lg">
          <p className="text-3xl font-bold">28</p>
          <p className="text-sm text-gray-600">Action Items</p>
        </div>
        <div className="p-6 border rounded-lg">
          <p className="text-3xl font-bold">$420</p>
          <p className="text-sm text-gray-600">Meeting Costs</p>
        </div>
      </div>

      {/* Attention Chart */}
      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6">Attention Score Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attentionData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Speaking Time */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Speaking Time Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={speakingData} dataKey="time" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {speakingData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topics */}
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-6">Top Topics</h2>
          <div className="space-y-4">
            {['Product Roadmap', 'Q3 Budget', 'Hiring Plan', 'Technical Architecture'].map((topic, i) => (
              <div key={topic} className="flex items-center justify-between">
                <span>{topic}</span>
                <div className="flex-1 mx-4 h-2 bg-gray-200 rounded">
                  <div className={`h-full bg-blue-600 rounded`} style={{ width: `${100 - i * 20}%` }}></div>
                </div>
                <span className="text-sm text-gray-600">{5 - i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}