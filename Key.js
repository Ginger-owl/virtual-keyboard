export default class Key {
  constructor(code, base, alter) {
    this.code = code;
    this.base = base;
    this.alter = alter;
    this.isService = ['ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight', 'ControlLeft', 'ControlRight', 'MetaLeft', 'MetaRight', 'Tab', 'Backspace', 'Enter', 'CapsLock'].includes(this.base);
    this.isNavigation = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(this.code);
  }

  static defineBtnSize(code) {
    if (['Tab', 'Backspace'].includes(code)) {
      return 'key-l';
    } if (['CapsLock', 'Enter'].includes(code)) {
      return 'key-xl';
    } if (['ShiftLeft', 'ShiftRight'].includes(code)) {
      return 'key-xxl';
    } if (['MetaLeft', 'MetaRight'].includes(code)) {
      return 'key-m';
    } if (['Space'].includes(code)) {
      return 'key-space';
    } if (['ArrowUp'].includes(code)) {
      return 'key-arrow-up';
    }
    return '';
  }

  render() {
    const serviceBtnClass = this.isService ? 'key-service' : '';
    const capsBtnClass = this.code === 'CapsLock' ? 'key-caps' : '';
    const arrowBtnClass = this.isNavigation ? 'key-arrow key-xs' : '';
    const sizeBtnClass = Key.defineBtnSize(this.code);
    const elClassNames = ['key', serviceBtnClass, arrowBtnClass, sizeBtnClass, capsBtnClass].join(' ').trim();
    const text = this.base;
    return (
      `<button id="key-${this.code}" class="${elClassNames}" data-base="${this.base}" data-alter='${this.alter}'>${text}</button>
      `
    );
  }
}
