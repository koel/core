import alertify from 'alertify.js'

export const alerts = {
  alert: (msg: string): void => alertify.alert(msg),
  confirm: (msg: string, okFunc: Function, cancelFunc?: Function): void => {
    alertify.confirm(msg, okFunc, cancelFunc)
  },

  log: (msg: string, type: string, cb?: Function): void => {
    alertify.logPosition('top right')
    alertify.closeLogOnClick(true)

    switch (type) {
      case 'success':
        alertify.success(msg, cb)
        break
      case 'error':
        alertify.error(msg, cb)
        break
      default:
        alertify.log(msg, cb)
        break
    }
  },

  success (msg: string, cb?: Function): void {
    this.log(msg, 'success', cb)
  },

  error (msg: string, cb?: Function): void {
    this.log(msg, 'error', cb)
  }
}
