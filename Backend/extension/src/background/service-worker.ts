const DASHBOARD_ORIGIN = 'http://localhost:3000';
const OFFSCREEN_DOC = 'offscreen.html';

let meetingId: string | null = null;
let isRecording = false;

async function getClerkToken(): Promise<string | null> {
  try {
    const cookie = await chrome.cookies.get({
      url: DASHBOARD_ORIGIN,
      name: '__session'
    });
    return cookie?.value || null;
  } catch (error) {
    console.error('Failed to get Clerk token:', error);
    return null;
  }
}

async function hasOffscreenDocument(): Promise<boolean> {
  const clients = await chrome.runtime.getContexts({
    contextTypes: ['OFFSCREEN_DOCUMENT'] as any,
    documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOC)]
  });
  return clients.length > 0;
}

async function createOffscreenDocument(streamId: string, token: string): Promise<void> {
  const hasOffscreen = await hasOffscreenDocument();
  
  if (hasOffscreen) {
    await chrome.offscreen.closeDocument();
  }

  await chrome.offscreen.createDocument({
    url: OFFSCREEN_DOC,
    reasons: ['AUDIO_CAPTURING'] as any,
    justification: 'Recording meeting audio and sending to backend'
  });

  meetingId = `meeting_${Date.now()}`;

  await new Promise<void>((resolve) => {
    setTimeout(resolve, 500);
  });

  await chrome.runtime.sendMessage({
    target: 'offscreen',
    type: 'START_OFFSCREEN',
    streamId,
    token,
    meetingId
  });

  isRecording = true;

  await chrome.storage.local.set({
    isRecording: true,
    meetingId,
    startTime: Date.now()
  });

  console.log('Recording started:', meetingId);
}

async function startRecording(streamId: string) {
  if (isRecording) {
    console.log('Already recording');
    return { success: false, error: 'Already recording' };
  }

  try {
    const token = await getClerkToken();
    if (!token) {
      return { success: false, error: 'Not authenticated. Please log in to the dashboard first.' };
    }

    await createOffscreenDocument(streamId, token);

    return { success: true, meetingId };

  } catch (error: any) {
    console.error('Failed to start recording:', error);
    return { success: false, error: error.message };
  }
}

async function stopRecording() {
  if (!isRecording) {
    return { success: false, error: 'Not recording' };
  }

  try {
    await chrome.runtime.sendMessage({
      target: 'offscreen',
      type: 'STOP_OFFSCREEN'
    });

    const hasOffscreen = await hasOffscreenDocument();
    if (hasOffscreen) {
      await chrome.offscreen.closeDocument();
    }

    isRecording = false;
    meetingId = null;

    await chrome.storage.local.set({
      isRecording: false,
      meetingId: null,
      startTime: null
    });

    console.log('Recording stopped');
    return { success: true };

  } catch (error: any) {
    console.error('Failed to stop recording:', error);
    return { success: false, error: error.message };
  }
}

async function getStatus() {
  const result = await chrome.storage.local.get(['isRecording', 'meetingId', 'startTime']);
  return result;
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('MeetMind extension installed');
  chrome.storage.local.set({ isRecording: false, meetingId: null, startTime: null });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_RECORDING':
      startRecording(message.streamId).then(sendResponse);
      return true;

    case 'STOP_RECORDING':
      stopRecording().then(sendResponse);
      return true;

    case 'GET_STATUS':
      getStatus().then(sendResponse);
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    if (
      tab.url.includes('meet.google.com') ||
      tab.url.includes('zoom.us') ||
      tab.url.includes('teams.microsoft.com')
    ) {
      chrome.action.setBadgeText({ text: '', tabId });
      chrome.action.setBadgeBackgroundColor({ color: '#22c55e', tabId });
    }
  }
});