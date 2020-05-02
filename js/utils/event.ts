import event from '@phanan/vuebus'
import { events as eventNames } from '@/config'

(event as any).$names = eventNames

export { event }
