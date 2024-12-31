document.getElementById('schedule').addEventListener('click',  () => {
  chrome.tabs.query({currentWindow: true, active: true}, (tabs)=> {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "schedule"});
  });
});
document.getElementById('reminder').addEventListener('click', () => {
  chrome.tabs.query({currentWindow: true, active: true}, (tabs)=> {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "reminder"});
  });
});