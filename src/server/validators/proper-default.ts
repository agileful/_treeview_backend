import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
import { Type } from 'src/utils'

@ValidatorConstraint({ name: 'properDefault', async: false })
export class ProperDefault implements ValidatorConstraintInterface {
  validate(defaultValue: any, args: ValidationArguments) {
    if (args.object['type']) {
      switch (args.object['type'] as Type) {
        case Type.Text:
          if (typeof defaultValue != 'string') return false
          break
        case Type.Num:
          if (typeof defaultValue != 'number') return false
          break
        case Type.DropDownList:
          if (
            !Array.isArray(args.object['options']) ||
            args.object['options'].length == 0
          )
            return false

          if (!args.object['options'].includes(defaultValue)) return false

          break
        case Type.Date:
          if (!['number', 'string'].includes(typeof defaultValue)) return false

          if (isNaN(new Date(defaultValue).getDate())) return false

          break
        case Type.Boolean:
          if (typeof defaultValue != 'boolean') return false

          break
      }
    }

    return true
  }

  defaultMessage(args: ValidationArguments) {
    if (
      args.value &&
      (!Array.isArray(args.object['options']) ||
        args.object['options'].length == 0)
    )
      return `options should be an array of strings`

    return `default value ${args.value} is not valid`
  }
}
