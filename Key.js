export default class Key {
  constructor({code, base, alter=""}) {
    this.code = code
    this.base = base
    this.alter = alter
    this.isService = this.checkIsService(this.base)
    this.isNavigation = this.checkIsNavigation(this.base)
  }

  checkIsService(base) {
    return (['Shift', 'Meta', 'Control', 'Alt', 'Tab', 'Enter', 'Backspace'].includes(base))
  }

  checkIsNavigation(code) {
    return (['37', '38', '39', '40'].includes(code))
  }

  render() {
    const serviceBtnClass = this.isService ? 'key-service' : ''
    const arrowBtnClass = this.isNavigation ? 'key-arrow' : ''
    const elClassNames = ['key', serviceBtnClass, arrowBtnClass].join(' ').trim()
    const text = this.base
    return (
      `<button id="key-${this.code}"class="${elClassNames}" data-base="${this.base}" data-alter="${this.alter}">${text}</button>
      `
    )
  }
}