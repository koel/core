/**
 * A fork of https://github.com/simplesmiler/vue-clickaway.
 * Trigger a function if the user clicks out of the bound element.
 */
export const clickaway = {
  bind (el: HTMLElement, { value }: { value: any }) {
    if (typeof value !== 'function') {
      /* eslint no-console: 0 */
      console.warn(`Expect a function, got ${value}`)
      return
    }

    document.addEventListener('click', (e: MouseEvent): void => el.contains(e.currentTarget as Node) || value())
  }
}
