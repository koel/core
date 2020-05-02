class Audio {
  context: AudioContext
  source: MediaElementAudioSourceNode
  element: HTMLMediaElement

  constructor(element: HTMLMediaElement) {
    const ContextClass = window.AudioContext ||
    window.webkitAudioContext ||
    window.mozAudioContext ||
    window.oAudioContext ||
    window.msAudioContext

    this.context = new ContextClass()
    this.source = this.context.createMediaElementSource(element)
    this.element = element
  }

  getContext (): AudioContext {
    return this.context
  }

  getSource (): MediaElementAudioSourceNode {
    return this.source
  }

  getElement(): HTMLMediaElement {
    return this.element
  }
}

export { Audio }
