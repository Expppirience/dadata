import { getBaseFetchQueryOptions } from "./utils/getBaseFetchOptions.js"
import { debounce } from "./utils/debounce.js"
import { createSuggestionElement } from "./utils/createSuggestionElement.js"
import { SUGGEST_URL } from "./utils/vars/vars.js"

export class DocsCompletion {
  constructor(formID, initialConfig) {
    this.formID = formID
    this.config = { count: 5, ...initialConfig }

    this.init()
    this.listeners()
  }

  init = () => {
    this.formRoot = document.getElementById(this.formID);
    this.formName = this.formRoot.querySelector('input[name="company"]');
    this.formShortName = this.formRoot.querySelector('input[name="short-name"]');
    this.formFullName = this.formRoot.querySelector('input[name="full-name"]');
    this.formDocs = this.formRoot.querySelector('input[name="docs"]');
    this.formAdress = this.formRoot.querySelector('input[name="adress"]');

    this.dropdown = this.formRoot.querySelector('[data-autocomplete-dropdown]')
    this.dropdownList = this.formRoot.querySelector('[data-autocomplete-list]')

  }

  listeners = () => {
    this.formName.addEventListener('input', this.handleNameInput)
    this.formName.addEventListener('focus', this.handleNameFocus)
    this.formRoot.addEventListener('submit', this.handleFormSubmit)
    window.addEventListener('click', this.hideDropdownOnOutsideClick)
  }

  handleFormSubmit = (e) => {
    e.preventDefault()
  }

  handleNameFocus = (e) => {
    const inputValue = e.currentTarget.value
    const haveSuggestions = this.suggestions?.length

    if (inputValue && haveSuggestions) {
      this.setDropdownState('active')
    }
  }

  handleNameInput = (e) => {
    const query = e.target.value

    if (!query) {
      this.dropdownList.innerHTML = 'Введите название компании 🙂'
      return;
    }

    debounce(() => this.getRequestedData(query), 300)
  }

  getRequestedData = async (query) => {
    this.setDropdownState('loading')
    this.setDropdownState('active')
    try {
      const response = await this.fetchForMatchCompanies(query)
      const data = await response.json()
      this.suggestions = data.suggestions

      if (this.suggestions.length) {
        this.dropdownList.innerHTML = ''
        this.suggestions.forEach((suggestion, index) => {
          this.insertSuggestElements(suggestion, index)
        })
      } else {
        this.dropdownList.innerHTML = 'Ничего не найдено 😔'
      }
    } catch (e) {
      this.dropdownList.innerHTML = 'Что-то пошло не так 😔'
    } finally {
      this.removeDropdownState('loading')
    }
  }

  insertSuggestElements = (suggestion, index) => {
    const { address, inn } = suggestion.data
    const config = { name: suggestion.value, address: address.value, docs: inn, id: index }

    this.dropdownList.insertAdjacentHTML('beforeend', createSuggestionElement(config))

    const dropdownButtonElement = this.formRoot.querySelector(`#dropdown-suggestion-${index}`)
    dropdownButtonElement.addEventListener('click', () => this.acceptSuggestion(suggestion))

  }

  acceptSuggestion = (suggestion) => {
    this.fillCompanyData(suggestion)
    this.removeDropdownState('active')
  }

  fillCompanyData = (suggestion) => {
    const { address, name, inn, kpp } = suggestion.data

    this.formName.value = suggestion.value
    this.formShortName.value = name.short_with_opf
    this.formFullName.value = name.full_with_opf
    this.formDocs.value = `${inn} / ${kpp}`
    this.formAdress.value = address.value
  }

  fetchForMatchCompanies = async (query) => {
    const requestConfig = { query, count: this.config.count }
    return await fetch(
      SUGGEST_URL,
      getBaseFetchQueryOptions('POST', requestConfig)
    )
  }

  hideDropdownOnOutsideClick = (e) => {
    const isException = e.target === this.formName
    if (!this.dropdown.contains(e.target) && !isException) {
      this.removeDropdownState('active')
    }
  }

  setDropdownState = (state) => {
    this.dropdown.classList.add(state)
  }

  removeDropdownState = (state) => {
    this.dropdown.classList.remove(state)
  }

}