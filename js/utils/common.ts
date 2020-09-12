import select from 'select'
import { eventBus, noop, pluralize } from '@/utils'
import { events } from '@/config'
import { sharedStore } from '@/stores'

/**
 * Load (display) a main panel (view).
 *
 * @param {...*} args     Extra data to attach to the view.
 */
export const loadMainView = (view: MainViewName, ...args: any[]): void => {
  eventBus.emit(events.LOAD_MAIN_CONTENT, view, ...args)
}

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

export const showOverlay = (message = 'Just a little patience…', type = 'loading', dismissable = false) => {
  eventBus.emit(events.SHOW_OVERLAY, { message, type, dismissable })
}

export const hideOverlay = (): void => {
  eventBus.emit(events.HIDE_OVERLAY)
}

export const copyText = (text: string): void => {
  let copyArea = document.querySelector('#copyArea') as HTMLTextAreaElement

  if (!copyArea) {
    copyArea = document.createElement('textarea')
    copyArea.id = 'copyArea'
    document.body.appendChild(copyArea)
  }

  copyArea.style.top = `${window.pageYOffset || document.documentElement.scrollTop}px`
  copyArea.value = text
  select(copyArea)
  document.execCommand('copy')
}

export const getDefaultCover = (): string => `${sharedStore.state.cdnUrl}/img/covers/unknown-album.png`

const createGhostDragImage = (event: DragEvent, text: string): void => {
  if (!event.dataTransfer) {
    return
  }

  let dragGhost = document.querySelector('#dragGhost') as HTMLElement

  if (!dragGhost) {
    // Create the element to be the ghost drag image.
    dragGhost = document.createElement('div')
    dragGhost.id = 'dragGhost'
    document.body.appendChild(dragGhost)
  }

  dragGhost.innerText = text
  event.dataTransfer.setDragImage(dragGhost, 0, 0)
}

/**
 * Handle song/album/artist drag start event.
 * @param {Song|Song[]} dragged Either an array of songs or a song/album/artist object
 */
export const startDragging = (event: DragEvent, dragged: Song | Song[] | Album | Artist, type: DragType): void => {
  if (!event.dataTransfer) {
    return
  }

  let text
  let songIds

  switch (type) {
    case 'Song':
      dragged = (<Song[]>[]).concat(<Song>dragged)
      text = dragged.length === 1
        ? `${dragged[0].title} by ${dragged[0].artist.name}`
        : pluralize(dragged.length, 'song')
      songIds = dragged.map(song => song.id)
      break

    case 'Album':
      dragged = <Album>dragged
      text = `All ${pluralize(dragged.songs.length, 'song')} in ${dragged.name}`
      songIds = dragged.songs.map(song => song.id)
      break

    case 'Artist':
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
