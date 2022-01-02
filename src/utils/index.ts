export { default as comparators } from './comparators'
export { default as converters } from './converters'
export * from './types'

export function makeResponse(data?: any) {
  if (data || typeof data == 'undefined') return { success: true, data }
  return { success: false }
}
