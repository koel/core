import event from '@phanan/vuebus'
import { events as eventNames } from '@/config'

event.$names = eventNames

export { event }
