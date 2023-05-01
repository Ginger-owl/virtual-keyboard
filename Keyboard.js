import Key from "./Key.js"
import {printSymbol, moveCursor, navChars} from "./index.js"

export default class Keyboard {
  constructor(layout, lang = "en") {
    this.lang = lang
    this.isCapsed = false
    this.layout = layout
    this.currentKeyboard = this.initKeyboardEl()
  }

  initKeyboardEl = () => {

    let keyboardRowsHtml = this.layout.foundation.map((row) => {
      const rowContentHtml = row.map((code) => {
        const currentLang = this.layout.langs.find(obj => obj.name === this.lang)
        const obj = currentLang.layout[code]
        const keyObj = new Key(code, obj.base, obj.alter)
        return keyObj.render()
      }).join("")
      const rowHtml = `<div class="keyboard__row">${rowContentHtml}</div>`
      return rowHtml
    })

    return `<div id="keyboard" class="keyboard">${keyboardRowsHtml.join("")}</div>`
  }

  swapLanguage = () => {
    if (this.lang === "en") {
      this.lang = "ru"
    } else {
      this.lang = "en"
    }
  }

  switchOnCaps = (capsState) => {
    const keys = document.getElementById("keyboard").querySelectorAll(".key")
    this.isCapsed = capsState
    keys.forEach((key) => {
      if (this.isCapsed === true) {
        key.innerHTML = key.dataset.alter
      } else {
        key.innerHTML = key.dataset.base
      }
    })
  }

  render() {
    document.body.insertAdjacentHTML("beforeend", this.currentKeyboard)
    this.listenKeyboardElems()
  }

  rerenderKeys = () => {
    const keyboardEl = document.getElementById("keyboard")
    const keys = keyboardEl.querySelectorAll(".key")
    keys.forEach((key) => {
      const code = key.id.split("-")[1]
      const currentLang = this.layout.langs.find(obj => obj.name === this.lang)
      key.dataset.base = currentLang["layout"][code]["base"]
      key.dataset.alter = currentLang["layout"][code]["alter"]
      if (this.isCapsed === true) {
        key.innerHTML = key.dataset.alter
      } else {
        key.innerHTML = key.dataset.base
      }
    })
  }

  listenKeyboardElems = () => {
    const keyboard = document.getElementById("keyboard")
    keyboard.addEventListener("click", (e) => {
      if (e.target.classList.contains("key")) {
        const keyId = e.target.id.split("-")[1]
        console.log(keyId)
        if(navChars.includes(keyId)) {
          moveCursor(keyId)
          return
        }
        // move lang change in a separate function
        if (keyId === "Fn") {
          this.swapLanguage()
          this.rerenderKeys()
          return
        } else {
          const char = e.target.textContent
          printSymbol(char)
        }
      }
    })

    keyboard.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains("key")) {
        const keyId = e.target.id.split("-")[1]
        if (keyId === "ShiftLeft" || keyId === "ShiftRight") {
          const capsState = !this.isCapsed
          this.switchOnCaps(capsState) 
        }
      }
    })

    keyboard.addEventListener('mouseup', (e) => {
      if (e.target.classList.contains("key")) {
        const keyId = e.target.id.split("-")[1]
        if (keyId === "ShiftLeft" || keyId === "ShiftRight") {
          const capsState = !this.isCapsed
          this.switchOnCaps(capsState) 
        }
      }
    })
  }

  listenCaps = () => {
    window.addEventListener("keydown", (e) => {
      if (e.code === "CapsLock") {
        const capsState = e.getModifierState("CapsLock")
        this.switchOnCaps(capsState) 
      }
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        const capsState = !this.isCapsed
        this.switchOnCaps(capsState) 
      }
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "CapsLock") {
        const capsState = e.getModifierState("CapsLock")
        this.switchOnCaps(capsState) 
      }
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        const capsState = !this.isCapsed
        this.switchOnCaps(capsState) 
      }
    });
  }
}