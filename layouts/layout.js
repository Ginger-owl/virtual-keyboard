import en from './en.js'
import ru from './ru.js'


const layout = {
  foundation: [
    ["192", "49", "50", "51", "52", "53", "54", "55", "56", "57", "48", "189", "187", "8"],
    ["9", "81", "87", "69", "82", "84", "89", "85", "73", "79", "80", "219", "221", "220"],
    ["20", "65", "83", "68", "70", "71", "72", "74", "75", "76", "186", "222", "13"],
    ["16", "90", "88", "67", "86", "66", "78", "77", "188", "190", "191", "16"],
    ["1000", "17", "18", "91", "32", "225", "93", "18", "37", "38", "40", "39"]
  ],
  langs: [
    {
      name: "en",
      layout: en
    },
    {
      name: "ru",
      layout: ru
    }
  ]
}

export default layout