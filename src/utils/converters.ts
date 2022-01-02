export default {
  'Text|>Num': (value: string) => {
    const converted = parseFloat(value)
    if (isNaN(converted)) return null
    return converted
  },

  'Text|>DropDownList': (value: string, options: string[]) => {
    if (options.includes(value)) return value
    return null
  },

  'Text|>Boolean': (value: string) => {
    if (value == 'true') return true
    if (value == 'false') return false

    if (value == 'on') return true
    if (value == 'off') return false

    if (value == '1') return true
    if (value == '0') return false

    return null
  },

  'Text|>Date': (value: string) => {
    const converted = new Date(value)
    if (isNaN(converted.getDate())) return null
    return converted
  },

  'Num|>Text': (value: number) => {
    return value?.toString()
  },

  'Num|>DropDownList': (value: number, options: string[]) => {
    const converted = value.toString()
    if (options.includes(converted)) return converted
    return null
  },

  'Num|>Boolean': (value: number) => {
    if (value != 0) return true
    return false
  },

  'Num|>Date': (value: number) => {
    const converted = new Date(value)
    if (isNaN(converted.getDate())) return null
    return converted
  },

  'Boolean|>Num': (value: boolean) => {
    if (value) return 1
    return 0
  },

  'Boolean|>Text': (value: boolean) => {
    if (value) return 'true'
    return 'false'
  },

  'Boolean|>DropDownList': (value: boolean, options: string[]) => {
    const converted = value ? 'true' : 'false'
    if (options.includes(converted)) return converted
    return null
  },

  'Boolean|>Date': (_value: boolean) => {
    return null
  },

  'DropDownList|>Num': (value: string) => {
    const converted = parseFloat(value)
    if (isNaN(converted)) return null
    return converted
  },

  'DropDownList|>Text': (value: string) => {
    return value
  },

  'DropDownList|>Boolean': (value: string) => {
    if (value == 'true') return true
    if (value == 'false') return false

    if (value == 'on') return true
    if (value == 'off') return false

    if (value == '1') return true
    if (value == '0') return false

    return null
  },

  'DropDownList|>Date': (value: string) => {
    const converted = new Date(value)
    if (isNaN(converted.getDate())) return null
    return converted
  },

  'Date|>Num': (value: Date) => {
    return value.getTime()
  },

  'Date|>Text': (value: Date) => {
    return value.toISOString()
  },

  'Date|>Boolean': (_value: Date) => {
    return null
  },

  'Date|>DropDownList': (_value: Date) => {
    return null
  },
}
