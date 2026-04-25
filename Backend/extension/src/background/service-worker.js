chrome.runtime.onInstalled.addListener(() => {
  console.log('MeetMind extension installed');
  
  chrome.storage.local.set({
    isRecording: false,
    meetingId: null,
    startTime: null,
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'START_RECORDING':
      chrome.storage.local.set({
        isRecording: true,
        meetingId: message.meetingId,
        startTime: Date.now(),
      });
      sendResponse({ success: true });
      break;
      
    case 'STOP_RECORDING':
      chrome.storage.local.set({
        isRecording: false,
        meetingId: null,
        startTime: null,
      });
      sendResponse({ success: true });
      break;
      
    case 'GET_STATUS':
      chrome.storage.local.get(['isRecording', 'meetingId', 'startTime'], (result) => {
        sendResponse(result);
      });
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