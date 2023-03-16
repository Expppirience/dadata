import { DocsCompletion } from './docsCompletion.js'

window.addEventListener('load', () => {
  const autoCompleteForm = new DocsCompletion('autocomplete-form', { count: 10 })
})

