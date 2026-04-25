'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

const integrationsList = [
  { name: 'notion', displayName: 'Notion', description: 'Auto-creates meeting pages with summary and tasks', icon: '📝' },
  { name: 'slack', displayName: 'Slack', description: 'Posts summaries and DMs action items', icon: '💬' },
  { name: 'google', displayName: 'Google Calendar', description: 'Books follow-up meetings automatically', icon: '📅' },
  { name: 'gmail', displayName: 'Gmail', description: 'Sends follow-up emails to participants', icon: '📧' },
  { name: 'jira', displayName: 'Jira', description: 'Creates tickets from action items', icon: '🎫' },
  { name: 'github', displayName: 'GitHub', description: 'Creates issues from technical discussions', icon: '🐙' },
  { name: 'salesforce', displayName: 'Salesforce', description: 'Updates CRM records and deal stages', icon: '☁️' },
  { name: 'asana', displayName: 'Asana', description: 'Creates task cards in project boards', icon: '✅' },
];

export default function IntegrationsPage() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchIntegrations();
    }
  }, [isLoaded, user]);

  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');
    if (connected || error) {
      fetchIntegrations();
    }
  }, [searchParams]);

  const fetchIntegrations = async () => {
    if (!user) return;
    
    try {
      console.log('Fetching integrations for user:', user.id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/`, {
        headers: { 'x-clerk-user-id': user.id }
      });
      const data = await res.json();
      console.log('Integrations API response:', data);
      const connected: Record<string, boolean> = {};
      data.forEach((i: any) => { 
        console.log(`Platform: ${i.platform}, isActive: ${i.isActive}`);
        connected[i.platform] = i.isActive; 
      });
      setIntegrations(connected);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const connectIntegration = async (platform: string) => {
    if (!user) return;
    
    let url: string;
    if (platform === 'notion') {
      url = `${process.env.NEXT_PUBLIC_API_URL}/notion/connect?userId=${user.id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_API_URL}/integrations/${platform}/connect?userId=${user.id}`;
    }
    window.location.href = url;
  };

  const disconnectIntegration = async (platform: string) => {
    if (!user) return;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/integrations/${platform}`, { 
        method: 'DELETE',
        headers: { 'x-clerk-user-id': user.id }
      });
      await fetchIntegrations();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isLoaded || loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Integrations</h1>
        <p className="text-gray-600">Connect your favorite tools</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationsList.map((integration) => (
          <div key={integration.name} className="border rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h3 className="font-semibold">{integration.displayName}</h3>
                  <p className="text-sm text-gray-600">{integration.description}</p>
                </div>
              </div>
              <div className={`h-3 w-3 rounded-full ${integrations[integration.name] ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            </div>
            {integrations[integration.name] ? (
              <button 
                onClick={() => disconnectIntegration(integration.name)}
                className="w-full py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50"
              >
                Disconnect
              </button>
            ) : (
              <button 
                onClick={() => connectIntegration(integration.name)}
                className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}