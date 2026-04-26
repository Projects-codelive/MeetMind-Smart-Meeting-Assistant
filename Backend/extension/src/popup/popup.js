const state = {
  meetingId: null,
  isRecording: false,
  status: 'inactive',
  startTime: null,
};

function updateUI() {
  document.getElementById('state-inactive').style.display = state.status === 'inactive' ? 'flex' : 'none';
  document.getElementById('state-active').style.display = state.status === 'active' ? 'flex' : 'none';
  document.getElementById('state-processing').style.display = state.status === 'processing' ? 'flex' : 'none';
  
  document.getElementById('stats').style.display = state.status !== 'inactive' ? 'grid' : 'none';
  document.getElementById('meeting-info').style.display = state.status !== 'inactive' ? 'block' : 'none';
  document.getElementById('checklist').style.display = state.status === 'processing' ? 'flex' : 'none';
  
  document.getElementById('btn-start').style.display = state.status === 'inactive' ? 'block' : 'none';
  document.getElementById('btn-stop').style.display = state.status === 'active' ? 'block' : 'none';
  document.getElementById('btn-dashboard').style.display = state.status === 'processing' ? 'block' : 'none';
}

document.getElementById('btn-start').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.id) return;

  chrome.tabs.sendMessage(tab.id, { type: 'START_CAPTURE' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('Could not connect to page:', chrome.runtime.lastError.message);
    }
  });

  state.status = 'active';
  state.startTime = Date.now();
  updateUI();
  
  setInterval(() => {
    if (state.status === 'active' && state.startTime) {
      const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      document.getElementById('duration').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  }, 1000);
});

document.getElementById('btn-stop').addEventListener('click', () => {
  state.status = 'processing';
  updateUI();
  
  setTimeout(() => {
    state.status = 'inactive';
    updateUI();
  }, 3000);
});

updateUI();