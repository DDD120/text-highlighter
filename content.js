const highlighter = document.createElement("selected-highlighter")
document.body.appendChild(highlighter)

chrome.runtime.onMessage.addListener((isOn) => {
  highlighter.setAttribute("onoff", isOn ? "on" : "off")
  chrome.storage.sync.set({ onoff: isOn })
})
