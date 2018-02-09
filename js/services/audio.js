export const audio = {
  context: null,
  source: null,
  element: null,

  init (element) {
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
    return this.context
  },

  getSource () {
    return this.source
  },

  getElement () {
    return this.element
  }
}
