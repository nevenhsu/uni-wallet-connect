import { UAParser } from 'ua-parser-js'

export const isMobileFn = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const parser = new UAParser(window.navigator.userAgent)
  const { type } = parser.getDevice()

  return type === 'mobile' || type === 'tablet'
}
