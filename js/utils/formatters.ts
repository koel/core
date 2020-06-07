/**
 * Convert a duration in seconds into H:i:s format.
 * If H is 0, it will be ommited.
 */
export const secondsToHis = (d: number): string => {
  d = ~~d

  const s = d % 60
  const sString = s < 10 ? `0${s}` : String(s)

  const i = Math.floor((d / 60) % 60)
  const iString = i < 10 ? `0${i}` : String(i)

  const h = Math.floor(d / 3600)
  const hString = h < 10 ? `0${h}` : String(h)

  return (hString === '00' ? '' : `${hString}:`) + iString + ':' + sString
}

/**
 * Parse the validation error from the server into a flattened array of messages.
 */
export const parseValidationError = (error: any): string[] =>
  Object.keys(error).reduce((messages, field) => messages.concat(error[field]), [])

/**
 * Turn <br> into new line characters.
 */
export const br2nl = (str: string): string => str ? str.replace(/<br\s*[/]?>/gi, '\n') : ''
