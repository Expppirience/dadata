export const createSuggestionElement = (config) => {
  const { name, address, docs, id } = config
  return `
    <li>
      <button class="dropdown__button" id="dropdown-suggestion-${id}">
        ${name}
        <p class="dropdown__sub-title">
        ${docs} ${address} 
        </p>
      </button>
    </li>
    `
}