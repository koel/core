import Pusher from 'pusher-js'

import { userStore } from '@/stores'
import { ls } from '.'

interface Socket {
  pusher: Pusher.Pusher | null
  channel: Pusher.Channel | null
  init(): Promise<void>
  broadcast(eventName: string, data?: any): Socket
  listen(eventName: string, cb: Function): Socket
}

export const socket: Socket = {
  pusher: null,
  channel: null,

  async init (): Promise<void> {
    return new Promise(resolve => {
      if (!window.PUSHER_APP_KEY) {
        return resolve()
      }

      this.pusher = new Pusher(window.PUSHER_APP_KEY, {
        authEndpoint: `${window.BASE_URL}api/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${ls.get('jwt-token')}`
          }
        },
        cluster: window.PUSHER_APP_CLUSTER,
        encrypted: true
      })

      this.channel = this.pusher.subscribe('private-koel')
      this.channel.bind('pusher:subscription_succeeded', () => resolve())
      this.channel.bind('pusher:subscription_error', () => resolve())
    })
  },

  broadcast (eventName: string, data: any = {}): Socket {
    this.channel && this.channel.trigger(`client-${eventName}.${userStore.current.id}`, data)
    return this
  },

  listen (eventName: string, cb: Function): Socket {
    this.channel && this.channel.bind(`client-${eventName}.${userStore.current.id}`, data => cb(data))
    return this
  }
}
