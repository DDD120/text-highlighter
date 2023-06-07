const highlighter = document.createElement("selected-highlighter")
document.body.appendChild(highlighter)

chrome.runtime.onMessage.addListener((onoff) => {
  highlighter.setAttribute("onoff", onoff ? "on" : "off")
})
