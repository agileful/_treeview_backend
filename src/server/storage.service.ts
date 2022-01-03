import { Injectable } from '@nestjs/common'
import { DropDownColumn, Type } from 'src/utils'
import { MigrationInterface } from './migration.service'

@Injectable()
export class StorageInterface {
  constructor(private readonly migration: MigrationInterface) {}

  validateAndTransformData(data: { [_: string]: any }) {
    const schema = this.migration.getSchema()
    let transformed = {}
    Object.keys(schema).forEach(key => {
      const column = schema[key]
      if (data[key])
        switch (column.column.type as Type) {
          case Type.Text:
            if (typeof data[key] != 'string') throw new Error()
            transformed[key] = data[key]
            break
          case Type.Num:
            if (typeof data[key] != 'number') throw new Error()
            transformed[key] = data[key]
            break
          case Type.DropDownList:
            if (typeof data[key] != 'string') throw new Error()
            if (!(column.column as DropDownColumn).options.includes(data[key]))
              throw new Error()
            transformed[key] = data[key]
            break
          case Type.Date:
            if (typeof data[key] != 'string' && typeof data[key] != 'number')
              throw new Error(typeof data[key])
            const date = new Date(data[key])
            if (isNaN(date.getDate())) throw new Error()
            transformed[key] = date
            break
          case Type.Boolean:
            if (typeof data[key] != 'boolean') throw new Error()
            transformed[key] = data[key]
            break
        }
      else transformed[key] = column.column.default
    })
    return transformed
  }
}
