import Key from "./Key.js"

const arrowKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']

const specialChars  = {
  'Tab': '\t',
  'Enter': '\n'
}


window.addEventListener('load', () => {
  const textareEl = createTextareaEl()
  document.body.insertAdjacentElement('afterbegin', textareEl)
  listenInput()
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

const row = [
  {
    code: 1,
    base: 'Tab',
    alter: 'Tab'
  },
  {
    code: 2,
    base: 'q',
    alter: 'Q'
  },
  {
    code: 3,
    base: 'w',
    alter: 'W'
  },
  {
    code: 4,
    base: 'e',
    alter: 'E'
  },
  {
    code: 5,
    base: 'r',
    alter: 'R'
  },
  {
    code: 6,
    base: 't',
    alter: 'T'
  },
  {
    code: 7,
    base: 'y',
    alter: 'Y'
  },
  {
    code: 8,
    base: 'u',
    alter: 'U'
  },
  {
    code: 9,
    base: 'i',
    alter: 'I'
  },
  {
    code: 10,
    base: 'o',
    alter: 'O'
  },
  {
    code: 11,
    base: 'p',
    alter: 'P'
  },
  {
    code: 12,
    base: '[',
    alter: '{'
  },
  {
    code: 13,
    base: ']',
    alter: '}'
  },
  {
    code: 14,
    base: '\\',
    alter: '|'
  }
]


class Keyboard {
  constructor(lang) {
    this.lang = lang
    this.isCapsed = false
    this.layout = 'Tab q w e r t y u i o p [ ] \\'
  }

  render() {
    let rowHtml = row.map((obj) => {
      const keyObj = new Key(obj)
      return keyObj.render()
    })

    const keyboardHtml = `<div id="keyboard">${rowHtml.join('')}</div>`
    document.body.insertAdjacentHTML('beforeend', keyboardHtml)
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

const keyboard = new Keyboard()

keyboard.render()
keyboard.listenCaps() 

