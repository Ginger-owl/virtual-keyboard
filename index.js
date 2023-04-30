import Key from "./Key.js"
import layout from "./layouts/layout.js"

const arrowKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']

const specialChars  = {
  'Tab': '\t',
  'Enter': '\n'
}


window.addEventListener('load', () => {
  const textareEl = createTextareaEl()
  document.body.insertAdjacentElement('afterbegin', textareEl)
  listenInput()
  document.querySelector('#textarea').focus()
})


function createTextareaEl() {
  const elem = document.createElement('textarea')
  elem.id = 'textarea'
  elem.classList = 'textarea'
  elem.rows = '16'
  return elem
}

function listenInput() {
  document.querySelector('#textarea').focus()
  document.addEventListener('keydown', (e) => {

    const textareaEl = document.querySelector('#textarea')

    const curPos = textareaEl.selectionStart
    const selectionEnd = textareaEl.selectionEnd
    console.log(selectionEnd, '|||', selectionEnd === curPos, curPos)
    if (!(['Shift', 'Meta', 'Control', 'Alt', 'CapsLock'].includes(e.key) ||  e.metaKey ||  arrowKeys.includes(e.key))) {
      console.log(e)
      console.log(e.metaKey)
      e.preventDefault()
      printSymbol(e.key)
    }
    
    if(['Shift', 'Meta', 'Control', 'Alt', 'Tab', 'Enter', 'Backspace', 'CapsLock'].includes(e.key)) {
      e.preventDefault()
    }
    document.querySelector('#textarea').focus()
  })
  
}

function printSymbol(keyChar) {
  /* console.log(keyChar) */
  const textareaEl = document.querySelector('#textarea')
  textareaEl.focus()
  // get currentPosition
  const curPos = textareaEl.selectionStart
  const selectionEnd = textareaEl.selectionEnd
  console.log(selectionEnd, '|||', selectionEnd === curPos, curPos)
  const beforeCursorInput = textareaEl.value.slice(0, curPos) || ''
  const afterCursorInput = textareaEl.value.slice(selectionEnd) || ''
  console.log(curPos)
  let char = ''
  if(['Shift', 'Meta', 'Control', 'Alt', 'Tab', 'Enter', 'Backspace', 'CapsLock'].includes(keyChar)) {
    if (keyChar === 'Backspace') {
      /* console.log(keyChar) */
      
      console.log(selectionEnd)
     if (curPos !== selectionEnd) {
      let selectedStart, selectedEnd
      if (curPos > selectionEnd) {
        selectedStart = selectionEnd
        selectedEnd = curPos
      } else {
        selectedStart = curPos
        selectedEnd = selectionEnd
      }
        const afterSelection = textareaEl.value.slice(selectedEnd) || ''
        const beforeSelection = textareaEl.value.slice(0, selectedStart) || ''
        textareaEl.value = `${beforeSelection}${afterSelection}`
        textareaEl.setSelectionRange(selectedStart, selectedStart)
        return
      } else {
        
      const newBeforeCursor = beforeCursorInput.slice(0, curPos - 1) || ''
      textareaEl.value = `${newBeforeCursor}${afterCursorInput}`
      textareaEl.setSelectionRange(curPos - 1, curPos - 1)
       }
      return
    } else if (['Shift', 'Meta', 'Control', 'Alt'].includes(keyChar)) { 
      return
    }else {
      char = specialChars[keyChar]
      
    }
  } else {
    char = keyChar
  }
 
  
  // inssert into Current Position
  textareaEl.value = `${beforeCursorInput}${char}${afterCursorInput}`
  textareaEl.setSelectionRange(curPos + 1, curPos + 1)
  
}

class Keyboard {
  constructor(lang) {
    this.lang = lang
    this.isCapsed = false
    this.layout = layout
    this.currentKeyboard = this.initKeyboardEl()
  }

  initKeyboardEl() {
    /* let currentLayout =  */

    let keyboardRowsHtml = layout.foundation.map((row) => {
      const rowContentHtml = row.map((code) => {
        const currentLang = this.layout.langs.find(obj => obj.id === this.lang)
        const obj = currentLang.layout.find(obj => obj.keyCode === code)
        const keyObj = new Key(obj)
        return keyObj.render()
      }).join('')
      const rowHtml = `<div class="keyboard__row">${rowContentHtml}</div>`
      return rowHtml
    })

    return `<div id="keyboard">${keyboardRowsHtml.join('')}</div>`
  }

  render() {
    document.body.insertAdjacentHTML('beforeend', this.currentKeyboard)
    this.listenKeyboardElems()
  }

  listenKeyboardElems() {
    document.getElementById('keyboard').addEventListener('click', (e) => {
      console.log(e.target, e.target.classList)
      if (e.target.classList.contains('key')) {
        const keyId = e.target.id.split('-')[1]
        if (keyId === '1000') {
          console.log('lang changed')
          if (this.lang === 'en') {
            this.lang = 'ru'
          } else {
            this.lang = 'en'
          }
          // TODO: refactor to partial rerender
          this.currentKeyboard = this.initKeyboardEl()
          document.getElementById('keyboard').remove()
          this.render()
          console.log('rendered', '||', this.lang, '||', this.currentKeyboard)
          return
        } else {
          const char = e.target.textContent
          printSymbol(char)
        }
      }
    })
  }

  switchOnCaps(capsState) {
    const keys = document.getElementById('keyboard').querySelectorAll('.key')
        this.isCapsed = capsState
        keys.forEach((key) => {
          if (this.isCapsed === true) {
            key.textContent = key.dataset.alter
          } else {
            key.textContent = key.dataset.base
          }
        })
  }

  listenCaps() {
    console.log('listenng')
    window.addEventListener("keydown", (e) => {
      if (e.key === 'CapsLock') {
        const capsState = e.getModifierState('CapsLock')
        this.switchOnCaps(capsState) 
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === 'CapsLock') {
        const capsState = e.getModifierState('CapsLock')
        this.switchOnCaps(capsState) 
      }
    });
    
  }
}

const keyboard = new Keyboard("ru")

keyboard.render()
keyboard.listenCaps() 

