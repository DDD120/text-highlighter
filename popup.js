const checkbox = document.querySelector("input")

chrome.storage.local
  .get(["onoff"])
  .then(({ onoff }) => (checkbox.checked = onoff))

checkbox.addEventListener("change", (e) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, e.target.checked)
  })
  chrome.storage.local.set({ onoff: e.target.checked })
})
