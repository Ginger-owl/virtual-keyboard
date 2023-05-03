import Keyboard from "./Keyboard.js"
import layout from "./layouts/layout.js"
import {get} from "./utils/storage.js"

const specialButtons = ["Shift", "shift", "Meta", "option", "Control", "control", "Alt", "command", "Tab", "tab", "Enter", "return", "Backspace", "delete", "CapsLock", "caps lock"]

const lineChars  = {
  "tab": "\t",
  "Tab": "\t",
  "return": "\n",
  "Enter": "\n"
}
export const navChars  =  ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]


window.addEventListener("DOMContentLoaded", () => {
  console.log('loaded')
  const textareEl = createTextareaEl()
  const titleEl = createTitleEl()
  const hintEl = createHintEl()
  document.body.insertAdjacentElement("afterbegin", hintEl)
  document.body.insertAdjacentElement("afterbegin", textareEl)
  document.body.insertAdjacentElement("afterbegin", titleEl)
  const savedLang = get('lang', 'en')
  const keyboard = new Keyboard(layout, savedLang)
  keyboard.render()
  keyboard.listenCaps() 
  keyboard.listenInput()
  document.querySelector("#textarea").focus()
})

// function creating Textarea
function createTextareaEl() {
  const elem = document.createElement("textarea")
  elem.id = "textarea"
  elem.classList = "textarea"
  elem.rows = "16"
  elem.wrap = 'hard'
  return elem
}

function createTitleEl() {
  const elem = document.createElement("h1")
  elem.id = "title"
  elem.classList = "title"
  elem.textContent = "RSS Virtual Keyboard"
  return elem
}

function createHintEl() {
  const elem = document.createElement("p")
  elem.id = "hint"
  elem.classList = "hint"
  elem.innerHTML = "Keyboard is based on Mac layouts.<br/>To change layout language press \"shift\" + \"command\"(Alt for windows) or click \"fn\""
  return elem
}

export function moveCursor(code) {
  const textareaEl = document.querySelector("#textarea")
  textareaEl.focus()
  
  const curPos = textareaEl.selectionStart
  if (code === 'ArrowLeft') {
    textareaEl.setSelectionRange(curPos - 1, curPos - 1)
  } else if (code === 'ArrowUp') {
    textareaEl.setSelectionRange(curPos - 1, curPos - 1)
  } else if (code === 'ArrowDown') {
    textareaEl.setSelectionRange(curPos + 1, curPos + 1)
  } else if (code === 'ArrowRight') {
    textareaEl.setSelectionRange(curPos + 1, curPos + 1)
  }
  textareaEl.focus()
}

// printing Symbols from inputs
export function printSymbol(keyChar) {
  const textareaEl = document.querySelector("#textarea")
  textareaEl.focus()
  // get currentPosition
  const curPos = textareaEl.selectionStart
  const selectionEnd = textareaEl.selectionEnd
  const beforeCursorInput = textareaEl.value.slice(0, curPos) || ""
  const afterCursorInput = textareaEl.value.slice(selectionEnd) || ""
  let char = ""
  if(specialButtons.includes(keyChar)) {
    if (keyChar === "Backspace" || keyChar === "delete") {
      
     if (curPos !== selectionEnd) {
      let selectedStart, selectedEnd
      if (curPos > selectionEnd) {
        selectedStart = selectionEnd
        selectedEnd = curPos
      } else {
        selectedStart = curPos
        selectedEnd = selectionEnd
      }
        const afterSelection = textareaEl.value.slice(selectedEnd) || ""
        const beforeSelection = textareaEl.value.slice(0, selectedStart) || ""
        textareaEl.value = `${beforeSelection}${afterSelection}`
        textareaEl.setSelectionRange(selectedStart, selectedStart)
        return
      } else {
        
      const newBeforeCursor = beforeCursorInput.slice(0, curPos - 1) || ""
      textareaEl.value = `${newBeforeCursor}${afterCursorInput}`
      textareaEl.setSelectionRange(curPos - 1, curPos - 1)
       }
      return
    } else if (["Shift", "shift", "Meta", "option", "Control", "control", "Alt", "command", "CapsLock", "caps lock"].includes(keyChar)) { 
      return
    } else {
      char = lineChars[keyChar]
      
    }
  } else {
    char = keyChar
  }
  // inssert into Current Position
  textareaEl.value = `${beforeCursorInput}${char}${afterCursorInput}`
  textareaEl.setSelectionRange(curPos + char.length, curPos + char.length)
}