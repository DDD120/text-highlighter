chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local
      .get(["onoff"])
      .then(({ onoff }) => chrome.tabs.sendMessage(tabId, onoff))
  }
})
