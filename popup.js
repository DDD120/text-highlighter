const send = (isChecked) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, isChecked)
  })
}

const checkbox = document.querySelector("input")

chrome.storage.sync.get(["onoff"], ({ onoff }) => (checkbox.checked = onoff))

checkbox.addEventListener("change", (e) => send(e.target.checked))
