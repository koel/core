import { $ } from '@/utils'

export const droppable = {
  update: (el, { value, arg }) => {
    el.addEventListener('dragenter', event => {
      event.preventDefault()
      $.addClass(el, 'droppable')
      event.dataTransfer.dropEffect = 'move'

      return false
    })

    el.addEventListener('dragover', event => event.preventDefault())

    el.addEventListener('dragleave', () => $.removeClass(el, 'droppable'))

    el.addEventListener('drop', event => {
      event.preventDefault()
      event.stopPropagation()
      $.removeClass(el, 'droppable')
      value(event)
    })
  }
}
