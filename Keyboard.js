import Key from "./Key.js"
import {printSymbol, moveCursor, navChars} from "./index.js"
import {set, del} from "./utils/storage.js"

export default class Keyboard {
  constructor(layout, lang = "en") {
    this.lang = lang
    this.isCapsed = false
    this.layout = layout
    this.currentKeyboard = this.initKeyboardEl()
  }

  initKeyboardEl() {

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
    del("lang")
    if (this.lang === "en") {
      this.lang = "ru"
    } else {
      this.lang = "en"
    }
    set("lang", this.lang)
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

  rerenderKeys() {
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

  disableActive(el) {
    el.classList.remove('key-active')
  }
  
  enableActive(el) {
    el.classList.add('key-active')
  }

  // listen input from Virtual Keyboard
  listenInput() {
  document.querySelector("#textarea").focus()
  document.addEventListener("keydown", (e) => {
    console.log(e)
    // make virtual button active
    const btn = document.getElementById(`key-${e.code}`)
    this.enableActive(btn)
    /* const textareaEl = document.querySelector("#textarea")

    const curPos = textareaEl.selectionStart
    const selectionEnd = textareaEl.selectionEnd */
    if (!(["ShiftLeft", "ShiftRight", "AltLeft", "AltRight", "ControlLeft", "ControlRight", "MetaLeft", "MetaRight"].includes(e.key) ||  e.metaKey ||  navChars.includes(e.key))) {
      e.preventDefault()
      printSymbol(e.key)
    }
    if ((e.code == "MetaLeft" && e.shiftKey) || (e.code == "ShiftLeft" && e.metaKey)) {
      this.swapLanguage()
      this.rerenderKeys()
      return
    }
    
    if(navChars.includes(e.code)) {
      moveCursor(e.key)
    }
    if (e.ctrlKey && e.key !== 'Meta') {
      setInterval(() => {
        const btn = document.querySelector(`#key-${e.code}`)
        this.disableActive(btn)
      }, 500)
    }
    document.querySelector("#textarea").focus()
  })
  document.addEventListener("keyup", (e) => {
    const btn = document.querySelector(`#key-${e.code}`)
    this.disableActive(btn)
  })
}

  listenKeyboardElems() {
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

  listenCaps() {
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