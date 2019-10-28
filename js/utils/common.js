/**
 * Other common methods.
 */
import select from 'select'
import { event, use } from '@/utils'
import { sharedStore } from '@/stores'

/**
 * Load (display) a main panel (view).
 *
 * @param {String} view   The view, which can be found under components/main-wrapper/main-content.
 * @param {...*}      Extra data to attach to the view.
 */
export const loadMainView = (view, ...args) => event.emit(event.$names.LOAD_MAIN_CONTENT, view, ...args)

/**
 * Force reloading window regardless of "Confirm before reload" setting.
 * This is handy for certain cases, for example Last.fm connect/disconnect.
 */
export const forceReloadWindow = () => {
  if (window.__UNIT_TESTING__) {
    return
  }

  window.onbeforeunload = () => {}
  window.location.reload()
}

/**
 * Show the overlay.
 *
 * @param  {String}  message
 * @param  {String}  type
 * @param  {Boolean} dismissable
 */
export const showOverlay = (message = 'Just a little patience…', type = 'loading', dismissable = false) =>
  event.emit(event.$names.SHOW_OVERLAY, { message, type, dismissable })

/**
 * Hide the overlay.
 */
export const hideOverlay = () => event.emit(event.$names.HIDE_OVERLAY)

/**
 * Copy a text into clipboard.
 *
 * @param  {string} txt
 */
export const copyText = text => use(document.querySelector('#copyArea'), copyArea => {
  copyArea.style.top = `${window.pageYOffset || document.documentElement.scrollTop}px`
  copyArea.value = text
  select(copyArea)
  document.execCommand('copy')
})

export const getDefaultCover = () => `${sharedStore.state.cdnUrl}/public/img/covers/unknown-album.png`

/**
 * Create a fancy ghost drag image.
 *
 * @param {DragEvent} event
 * @param {string} text
 */
export const createGhostDragImage = (event, text) => use(document.querySelector('#dragGhost'), ghost => {
  ghost.innerText = text
  event.dataTransfer.setDragImage(ghost, 0, 0)
})
