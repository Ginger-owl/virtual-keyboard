function detectLang(e, layoutObj, currentLang) {
  const that = e
  const currentCode = getCode(that)
  const currentChar = getCharacter(that)
  const expectedChar = getExpectedChar(currentCode, layoutObj['langs'][currentLang]) // currentLayout
  if (currentChar != expectedChar) {
    layoutObj.langs.forEach(lang => {
      if (lang['layout'][currentCode] === currentChar) {
        return lang['name']
        /* const detectedLang = lang['name']
        swapLayout(detectedLang)
        return */
      }
    })
  }
}

function getCode(e) {
  return e.code
}

function getCharacter(e) {
  return e.key
}

function getExpectedChar(code, layout) {
  return layout[code]
}

export default detectLang