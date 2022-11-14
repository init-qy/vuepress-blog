import createSearchPlugin from './search-plugin'

export default function createVuePressPlugins() {
  const vuePressPlugins = []
  vuePressPlugins.push(createSearchPlugin())
  return vuePressPlugins
}
