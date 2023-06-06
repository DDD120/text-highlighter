const styledDraggble = ({ x, y }) => `
  #container {
    position: fixed;
    top: ${y};
    left: ${x};
    transform: ${x === "50%" ? "translateX(-50%)" : null}
  }
`

class Draggble extends HTMLElement {
  constructor() {
    super()

    this.handle = null
    this.render()
  }

  async render() {
    this.attachShadow({ mode: "open" })
    const style = document.createElement("style")

    const { x, y } = await this.getValueFromStorage("position")
    style.textContent = styledDraggble({
      y: y ? `${y}px` : "10px",
      x: x ? `${x}px` : "50%",
    })
    this.shadowRoot.appendChild(style)
    this.shadowRoot.innerHTML += `
      <div id="container">
        <slot></slot>
      </div>
    `
    this.handle = this.shadowRoot
      .querySelector("slot")
      .assignedNodes()[0]
      .nextElementSibling.querySelector(this.getAttribute("handle"))
    this.handle.addEventListener("mousedown", this.handleMousedown.bind(this))
    this.handle.addEventListener("dragstart", () => false)
  }

  connectedCallback() {}

  getValueFromStorage(key) {
    return new Promise((resolve) => {
      chrome.storage.sync.get([key], (result) => {
        if (!result[key]) return
        return resolve(result[key])
      })
    })
  }

  handleMousedown(e) {
    const { left, top } = this.shadowRoot
      .querySelector("#container")
      .getClientRects()[0]

    let shiftX = e.clientX - left
    let shiftY = e.clientY - top

    const moveAt = (pageX, pageY) => {
      const style = this.shadowRoot.querySelector("style")
      style.textContent = styledDraggble({
        y: `${pageY - shiftY}px`,
        x: `${pageX - shiftX}px`,
      })
    }
    moveAt(e.clientX, e.clientY)

    const handleMousemove = (e) => {
      moveAt(e.clientX, e.clientY)
    }

    document.addEventListener("mousemove", handleMousemove)
    this.handle.addEventListener("mouseup", (e) => {
      chrome.storage.sync.set({
        position: { x: e.clientX - shiftX, y: e.clientY - shiftY },
      })
      document.removeEventListener("mousemove", handleMousemove)
      this.handle.onmouseup = null
    })
  }
}

customElements.define("draggble-element", Draggble)
