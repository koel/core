import { DirectiveOptions } from 'vue'

/**
 * A fork of https://github.com/simplesmiler/vue-clickaway.
 * Trigger a function if the user clicks out of the bound element.
 */
export const clickaway: DirectiveOptions = {
  bind (el: HTMLElement, { value }: { value: any }): void {
    if (typeof value !== 'function') {
      /* eslint no-console: 0 */
      console.warn(`Expect a function, got ${value}`)
      return
    }

    document.addEventListener('click', (e: MouseEvent): void => el.contains(e.target as Node) || value())
  }
}
