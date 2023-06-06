const send = (isChecked) => {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, isChecked)
    })
  })
}

const checkbox = document.querySelector("input")

chrome.storage.sync.get(["onoff"], ({ onoff }) => (checkbox.checked = onoff))

checkbox.addEventListener("change", (e) => send(e.target.checked))
