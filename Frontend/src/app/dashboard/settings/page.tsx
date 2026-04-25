'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" defaultValue="Development User" className="w-full max-w-md px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" defaultValue="dev@localhost" className="w-full max-w-md px-4 py-2 border rounded-lg" disabled />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Summary</p>
              <p className="text-sm text-gray-600">Automatically generate meeting summaries</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Attention Tracking</p>
              <p className="text-sm text-gray-600">Track meeting attention using webcam</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Pre-meeting Briefing</p>
              <p className="text-sm text-gray-600">Get briefing before scheduled meetings</p>
            </div>
            <input type="checkbox" defaultChecked className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">API Keys</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">GROQ API Key</label>
            <input type="password" placeholder="Enter your Groq API key" className="w-full max-w-md px-4 py-2 border rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}