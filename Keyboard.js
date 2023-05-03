/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
import Key from './Key.js';
import { set, del } from './utils/storage.js';

const specialButtons = ['Shift', 'shift', 'Meta', 'option', 'Control', 'control', 'Alt', 'command', 'Tab', 'tab', 'Enter', 'return', 'Backspace', 'delete', 'CapsLock', 'caps lock'];

const lineChars = {
  tab: '\t',
  Tab: '\t',
  return: '\n',
  Enter: '\n',
};
export const navChars = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];

export default class Keyboard {
  constructor(layout, lang = 'en') {
    this.lang = lang;
    this.isCapsed = false;
    this.layout = layout;
    this.currentKeyboard = this.initKeyboardEl();
  }

  initKeyboardEl() {
    const keyboardRowsHtml = this.layout.foundation.map((row) => {
      const rowContentHtml = row.map((code) => {
        const currentLang = this.layout.langs.find((obj) => obj.name === this.lang);
        const obj = currentLang.layout[code];
        const keyObj = new Key(code, obj.base, obj.alter);
        return keyObj.render();
      }).join('');
      const rowHtml = `<div class="keyboard__row">${rowContentHtml}</div>`;
      return rowHtml;
    });

    return `<div id="keyboard" class="keyboard">${keyboardRowsHtml.join('')}</div>`;
  }

  swapLanguage = () => {
    del('lang');
    if (this.lang === 'en') {
      this.lang = 'ru';
    } else {
      this.lang = 'en';
    }
    set('lang', this.lang);
  };

  switchOnCaps = (capsState) => {
    const keys = document.getElementById('keyboard').querySelectorAll('.key');
    this.isCapsed = capsState;
    keys.forEach((key) => {
      if (this.isCapsed === true) {
        key.innerHTML = key.dataset.alter;
      } else {
        key.innerHTML = key.dataset.base;
      }
    });
  };

  render() {
    document.body.insertAdjacentHTML('beforeend', this.currentKeyboard);
    this.listenKeyboardElems();
  }

  rerenderKeys() {
    const keyboardEl = document.getElementById('keyboard');
    const keys = keyboardEl.querySelectorAll('.key');
    keys.forEach((key) => {
      const code = key.id.split('-')[1];
      const currentLang = this.layout.langs.find((obj) => obj.name === this.lang);
      key.dataset.base = currentLang.layout[code].base;
      key.dataset.alter = currentLang.layout[code].alter;
      if (this.isCapsed === true) {
        key.innerHTML = key.dataset.alter;
      } else {
        key.innerHTML = key.dataset.base;
      }
    });
  }

  static disableActive(el) {
    el.classList.remove('key-active');
  }

  static enableActive(el) {
    el.classList.add('key-active');
  }

  static moveCursor(code) {
    const textareaEl = document.querySelector('#textarea');
    textareaEl.focus();

    const curPos = textareaEl.selectionStart;
    if (code === 'ArrowLeft') {
      textareaEl.setSelectionRange(curPos - 1, curPos - 1);
    } else if (code === 'ArrowUp') {
      textareaEl.setSelectionRange(curPos - 1, curPos - 1);
    } else if (code === 'ArrowDown') {
      textareaEl.setSelectionRange(curPos + 1, curPos + 1);
    } else if (code === 'ArrowRight') {
      textareaEl.setSelectionRange(curPos + 1, curPos + 1);
    }
    textareaEl.focus();
  }

  // printing Symbols from inputs
  static printSymbol(keyChar) {
    const textareaEl = document.querySelector('#textarea');
    textareaEl.focus();
    // get currentPosition
    const curPos = textareaEl.selectionStart;
    const { selectionEnd } = textareaEl;
    const beforeCursorInput = textareaEl.value.slice(0, curPos) || '';
    const afterCursorInput = textareaEl.value.slice(selectionEnd) || '';
    let char = '';
    if (specialButtons.includes(keyChar)) {
      if (keyChar === 'Backspace' || keyChar === 'delete') {
        if (curPos !== selectionEnd) {
          let selectedStart; let
            selectedEnd;
          if (curPos > selectionEnd) {
            selectedStart = selectionEnd;
            selectedEnd = curPos;
          } else {
            selectedStart = curPos;
            selectedEnd = selectionEnd;
          }
          const afterSelection = textareaEl.value.slice(selectedEnd) || '';
          const beforeSelection = textareaEl.value.slice(0, selectedStart) || '';
          textareaEl.value = `${beforeSelection}${afterSelection}`;
          textareaEl.setSelectionRange(selectedStart, selectedStart);
          return;
        }

        const newBeforeCursor = beforeCursorInput.slice(0, curPos - 1) || '';
        textareaEl.value = `${newBeforeCursor}${afterCursorInput}`;
        textareaEl.setSelectionRange(curPos - 1, curPos - 1);

        return;
      } if (['Shift', 'shift', 'Meta', 'option', 'Control', 'control', 'Alt', 'command', 'CapsLock', 'caps lock'].includes(keyChar)) {
        return;
      }
      char = lineChars[keyChar];
    } else {
      char = keyChar;
    }
    // inssert into Current Position
    textareaEl.value = `${beforeCursorInput}${char}${afterCursorInput}`;
    textareaEl.setSelectionRange(curPos + char.length, curPos + char.length);
  }

  // listen input from Virtual Keyboard
  listenInput() {
    document.querySelector('#textarea').focus();
    document.addEventListener('keydown', (e) => {
      console.log(e);
      // make virtual button active
      const btn = document.getElementById(`key-${e.code}`);
      Keyboard.enableActive(btn);
      /* const textareaEl = document.querySelector("#textarea")

    const curPos = textareaEl.selectionStart
    const selectionEnd = textareaEl.selectionEnd */
      if (!(['ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight', 'ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight'].includes(e.key) || e.metaKey || navChars.includes(e.key))) {
        e.preventDefault();
        Keyboard.printSymbol(e.key);
      }
      if ((e.code === 'MetaLeft' && e.shiftKey) || (e.code === 'ShiftLeft' && e.metaKey)) {
        this.swapLanguage();
        this.rerenderKeys();
        return;
      }

      if (navChars.includes(e.code)) {
        this.moveCursor(e.key);
      }
      if (e.ctrlKey && e.key !== 'Meta') {
        setInterval(() => {
          const anotherBtn = document.querySelector(`#key-${e.code}`);
          Keyboard.disableActive(anotherBtn);
        }, 500);
      }
      document.querySelector('#textarea').focus();
    });
    document.addEventListener('keyup', (e) => {
      const btn = document.querySelector(`#key-${e.code}`);
      Keyboard.disableActive(btn);
    });
  }

  listenKeyboardElems() {
    const keyboard = document.getElementById('keyboard');
    keyboard.addEventListener('click', (e) => {
      if (e.target.classList.contains('key')) {
        const keyId = e.target.id.split('-')[1];
        console.log(keyId);
        if (navChars.includes(keyId)) {
          this.moveCursor(keyId);
          return;
        }
        // move lang change in a separate function
        if (keyId === 'Fn') {
          this.swapLanguage();
          this.rerenderKeys();
        } else {
          const char = e.target.textContent;
          Keyboard.printSymbol(char);
        }
      }
    });

    keyboard.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('key')) {
        const keyId = e.target.id.split('-')[1];
        if (keyId === 'ShiftLeft' || keyId === 'ShiftRight') {
          const capsState = !this.isCapsed;
          this.switchOnCaps(capsState);
        }
      }
    });

    keyboard.addEventListener('mouseup', (e) => {
      if (e.target.classList.contains('key')) {
        const keyId = e.target.id.split('-')[1];
        if (keyId === 'ShiftLeft' || keyId === 'ShiftRight') {
          const capsState = !this.isCapsed;
          this.switchOnCaps(capsState);
        }
      }
    });
  }

  listenCaps() {
    window.addEventListener('keydown', (e) => {
      if (e.code === 'CapsLock') {
        const capsState = e.getModifierState('CapsLock');
        this.switchOnCaps(capsState);
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        const capsState = !this.isCapsed;
        this.switchOnCaps(capsState);
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'CapsLock') {
        const capsState = e.getModifierState('CapsLock');
        this.switchOnCaps(capsState);
      }
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        const capsState = !this.isCapsed;
        this.switchOnCaps(capsState);
      }
    });
  }
}
