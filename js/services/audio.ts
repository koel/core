interface AudioService {
  context: AudioContext | null
  source: MediaElementAudioSourceNode | null
  element: HTMLMediaElement | null

  init (element: HTMLMediaElement): void
  getContext(): AudioContext
  getSource(): MediaElementAudioSourceNode
  getElement(): HTMLMediaElement
}

export const audio: AudioService = {
  context: null,
  source: null,
  element: null,

  init (element: HTMLMediaElement): void {
    const AudioContext = window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext ||
      window.oAudioContext ||
      window.msAudioContext

    this.context = new AudioContext()
    this.source = this.context.createMediaElementSource(element)
    this.element = element
  },

  getContext () {
    return this.context!
  },

  getSource () {
    return this.source!
  },

  getElement () {
    return this.element!
  }
}
