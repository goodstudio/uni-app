const { format } = require('./lang')
const { osLocale } = require('os-locale-s/cjs')

function getLocale () {
  return format(process.env.UNI_HBUILDERX_LANGID || osLocale.sync({ spawn: false, cache: false }) || defaultLocale)
}

module.exports = {
  getLocale
}
