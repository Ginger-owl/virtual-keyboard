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
  document.addEventListener('keydown', (e) => {
    console.log("Keydown event", e)
    if(!['Shift', 'Meta', 'Control', 'Alt', 'Tab', 'Enter', 'Backspace'].includes(e.key)) {
      printSymbol(e.key)
    } else {
      e.preventDefault()
    }
    
  })
}

function printSymbol(keyChar) {
  let char = ''
  if(['Tab', 'Enter', 'Backspace'].includes(keyChar)) {
    if (keyChar === 'Backspace') {
      textarea.value = textarea.value.slice(0, -1)
      return
    } else {
      char = specialChars[keyChar]
    }
  } else {
    char = keyChar
  }

  const textarea = document.getElementById('textarea')
  textarea.value += char
}