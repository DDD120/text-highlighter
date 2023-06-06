const template = `
  <draggble-element handle=".drag">
    <div id="selectedHighlighter">
      <div class="color">
        <button type="button" title="yellow"/>
      </div>
      <div class="drag">
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m0 0h24v24h-24z" /><path fill="currentColor" d="m11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
      </div>
    </div>
  </draggble-element>
`
const styledHighlighter = ({ display = "flex" }) => `
  :host {
    position: relative;
    z-index: 9999;
  }
  #selectedHighlighter {
    width: 80px;
    heigth: 40px;
    box-sizing: border-box;
    display: ${display};
    justify-content: space-between;
    align-items: center;
    overflow: hidden;
    color: white;
    border-radius: 6px;
  }
  .color button {
    display: block;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background: #fffbb0;
    border: none;
  }
  .drag {
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #151515;
  }
  svg {
    width: 100%;
    color: #cccccc;
  }
`

class SelectedHighlighter extends HTMLElement {
  constructor() {
    super()
    this.render()
    this.range = []
  }

  render() {
    this.attachShadow({ mode: "open" })
    chrome.storage.sync.get(["onoff"], ({ onoff }) => {
      const style = document.createElement("style")
      style.textContent = styledHighlighter({
        display: onoff ? "flex" : "none",
      })
      this.shadowRoot.appendChild(style)
    })

    this.shadowRoot.innerHTML += template
    this.shadowRoot
      .querySelector(".color")
      .addEventListener("click", this.highlightSelection.bind(this))
  }

  static get observedAttributes() {
    return ["onoff"]
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "onoff") {
      const display = newValue === "on" ? "flex" : "none"
      const style = this.shadowRoot.querySelector("style")
      style.textContent = styledHighlighter({
        display,
      })
    }
  }

  highlightSelection() {
    if (window.getSelection().toString().length === 0) return
    this.range = [...this.range, window.getSelection().getRangeAt(0)]
    const userHighlight = new Highlight(...this.range)
    CSS.highlights.set("highlight", userHighlight)
    window.getSelection().empty()
  }
}

customElements.define("selected-highlighter", SelectedHighlighter)
