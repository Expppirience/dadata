
export const debounce = (callback, delay) => {
  let timeoutId

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(() => {
    callback()
  }, delay)
}