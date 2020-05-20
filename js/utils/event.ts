import BaseVueBus from '@phanan/vuebus'
import { events as eventNames } from '@/config'

class Bus extends BaseVueBus {
  readonly $names: {
    [key: string]: string
  }

  constructor () {
    super()
    this.$names = eventNames
  }
}

const event = new Bus()

export { event }
