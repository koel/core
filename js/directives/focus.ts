import { DirectiveOptions } from 'vue'

/**
 * A simple directive to set focus into an input field when it's shown.
 */
export const focus: DirectiveOptions = {
  inserted: (el: HTMLElement): void => el.focus()
}
