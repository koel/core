import event from '@phanan/vuebus'
import { events as eventNames } from '@/config'

(<any>event).$names = eventNames

export { event }
