/* eslint-disable import/extensions */
import Keyboard from './Keyboard.js';
import layout from './layouts/layout.js';
import { get } from './utils/storage.js';

// function creating Textarea
function createTextareaEl() {
  const elem = document.createElement('textarea');
  elem.id = 'textarea';
  elem.classList = 'textarea';
  elem.rows = '16';
  elem.wrap = 'hard';
  return elem;
}

function createTitleEl() {
  const elem = document.createElement('h1');
  elem.id = 'title';
  elem.classList = 'title';
  elem.textContent = 'RSS Virtual Keyboard';
  return elem;
}

function createHintEl() {
  const elem = document.createElement('p');
  elem.id = 'hint';
  elem.classList = 'hint';
  elem.innerHTML = 'Keyboard is based on Mac layouts.<br/>To change layout language press "shift" + "option"("alt" for windows/linux) or click "fn"';
  return elem;
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('loaded');
  const textareEl = createTextareaEl();
  const titleEl = createTitleEl();
  const hintEl = createHintEl();
  document.body.insertAdjacentElement('afterbegin', hintEl);
  document.body.insertAdjacentElement('afterbegin', textareEl);
  document.body.insertAdjacentElement('afterbegin', titleEl);
  const savedLang = get('lang', 'en');
  const keyboard = new Keyboard(layout, savedLang);
  keyboard.render();
  keyboard.listenCaps();
  keyboard.listenInput();
  document.querySelector('#textarea').focus();
});
