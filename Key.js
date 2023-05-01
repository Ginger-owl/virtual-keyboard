export default class Key {
  constructor(code, base, alter) {
    this.code = code
    this.base = base
    this.alter = alter
    this.isService = this.checkIsService(this.base)
    this.isNavigation = this.checkIsNavigation(this.code)
  }

  checkIsService(base) {
    return (["ShiftLeft", "ShiftRight", "AltLeft", "AltRight", "ControlLeft", "ControlRight", "MetaLeft", "MetaRight", "Tab", "Backspace", "Enter"].includes(base))
  }

  checkIsNavigation(code) {
    return (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(code))
  }

  defineBtnSize(code) {
    if (["Tab", "Backspace"].includes(code)) {
      return "key-l"
    } else if (["CapsLock", "Enter"].includes(code)) {
      return "key-xl"
    } else if (["ShiftLeft", "ShiftRight"].includes(code)) {
      return "key-xxl"
    } else if (["MetaLeft", "MetaRight"].includes(code)) {
      return "key-m"
    } else if (["Space"].includes(code)) {
      return "key-space"
    } else if (["ArrowUp"].includes(code)) {
      return "key-arrow-up"
    }else {
      return ""
    }
  }

  render() {
    const serviceBtnClass = this.isService ? "key-service" : ""
    const arrowBtnClass = this.isNavigation ? "key-arrow key-xs" : ""
    const sizeBtnClass = this.defineBtnSize(this.code)
    const elClassNames = ["key", serviceBtnClass, arrowBtnClass, sizeBtnClass].join(" ").trim()
    const text = this.base
    return (
      `<button id="key-${this.code}" class="${elClassNames}" data-base="${this.base}" data-alter='${this.alter}'>${text}</button>
      `
    )
  }
}