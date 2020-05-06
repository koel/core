/**
 * Other common methods.
 */
import select from 'select'
import { event, noop, pluralize, use } from '@/utils'
import { sharedStore } from '@/stores'
import { dragTypes } from '@/config'

/**
 * Load (display) a main panel (view).
 *
 * @param {String} view   The view, which can be found under components/main-wrapper/main-content.
 * @param {...*} args     Extra data to attach to the view.
 */
export const loadMainView = (view: string, ...args: any[]): void =>
  event.emit(event.$names.LOAD_MAIN_CONTENT, view, ...args)

/**
 * Force reloading window regardless of "Confirm before reload" setting.
 * This is handy for certain cases, for example Last.fm connect/disconnect.
 */
export const forceReloadWindow = (): void => {
  if (window.__UNIT_TESTING__) {
    return
  }

  window.onbeforeunload = noop
  window.location.reload()
}

/**
 * Show the overlay.
 */
export const showOverlay = (message = 'Just a little patience…', type = 'loading', dismissable = false): void =>
  event.emit(event.$names.SHOW_OVERLAY, { message, type, dismissable })

/**
 * Hide the overlay.
 */
export const hideOverlay = (): void => event.emit(event.$names.HIDE_OVERLAY)

/**
 * Copy a text into clipboard.
 */
export const copyText = (text: string): void =>
  use(<HTMLTextAreaElement>document.querySelector('#copyArea'), (copyArea: HTMLTextAreaElement): void => {
    copyArea.style.top = `${window.pageYOffset || document.documentElement.scrollTop}px`
    copyArea.value = text
    select(copyArea)
    document.execCommand('copy')
  }
)

export const getDefaultCover = (): string => `${sharedStore.state.cdnUrl}/public/img/covers/unknown-album.png`

/**
 * Create a fancy ghost drag image.
 */
const createGhostDragImage = (event: DragEvent, text: string): void => {
  use(<HTMLElement>document.querySelector('#dragGhost'), (ghost: HTMLElement): void => {
    if (!event.dataTransfer) {
      return
    }

    ghost.innerText = text
    event.dataTransfer.setDragImage(ghost, 0, 0)
  })
}


/**
 * Handle song/album/artist drag start event.
 *
 * @param {DragEvent} event The drag event
 * @param {Song|Song[]} dragged Either an array of songs or a song/album/artist object
 * @param {string} type The drag type (see @/config/drag-types.js)
 */
export const startDragging = (event: DragEvent, dragged: Song | Song[] | Album | Artist, type: string): void => {
  if (!event.dataTransfer) {
    return
  }

  let text
  let songIds

  switch (type) {
    case dragTypes.SONGS:
      dragged = (<Song[]>[]).concat(<Song>dragged)
      text = dragged.length === 1
        ? `${dragged[0].title} by ${dragged[0].artist.name}`
        : pluralize(dragged.length, 'song')
      songIds = dragged.map(song => song.id)
      break

    case dragTypes.ALBUM:
      dragged = <Album>dragged
      text = `All ${pluralize(dragged.songs.length, 'song')} in ${dragged.name}`
      songIds = dragged.songs.map(song => song.id)
      break

    case dragTypes.ARTIST:
      dragged = <Artist>dragged
      text = `All ${pluralize(dragged.songs.length, 'song')} by ${dragged.name}`
      songIds = dragged.songs.map(song => song.id)
      break

    default:
      throw Error(`Invalid drag type: ${type}`)
  }

  event.dataTransfer.setData('application/x-koel.text+plain', songIds.join(','))
  event.dataTransfer.effectAllowed = 'move'

  createGhostDragImage(event, text)
}
