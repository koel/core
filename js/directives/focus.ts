/**
 * A simple directive to set focus into an input field when it's shown.
 */
export const focus = {
  inserted: (el: HTMLElement): void => el.focus()
}
