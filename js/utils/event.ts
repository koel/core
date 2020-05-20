import Vue from 'vue'
import { events as eventNames } from '@/config'

type EmitObjectBasedDeclaration = {
  [event: string]: Function
}

function isEmitDeclaration (
  value: string | string[] | EmitObjectBasedDeclaration
): value is EmitObjectBasedDeclaration {
  return (value as EmitObjectBasedDeclaration) instanceof Object
}

type EventNames = {
  [propName: string]: string
}

class VueBus {
  private readonly bus: Vue
  readonly $names: EventNames

  constructor (names: EventNames) {
    this.bus = new Vue()
    this.$names = names
  }

  emit (event: string, ...args: any[]): VueBus {
    this.bus.$emit(event, ...args)

    return this
  }

  on (event: string | string[] | EmitObjectBasedDeclaration, callback?: Function): VueBus {
    if (!isEmitDeclaration(event)) {
      if (!callback) {
        throw new Error('[VueBus] Expected callback to be a function, got undefined')
      }

      this.bus.$on(event, callback)
    } else {
      Object.keys(event).forEach(key => this.bus.$on(key, event[key]))
    }

    return this
  }
}

const event = new VueBus(eventNames)

export { event }
