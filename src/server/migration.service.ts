import { ConflictException, Injectable } from '@nestjs/common'
import { MigrationService } from 'src/migration/migration.service'
import { StorageService } from 'src/storage/storage.service'
import {
  BooleanColumn,
  Column,
  DateColumn,
  DropDownColumn,
  NumColumn,
  Style,
  TextColumn,
  Type,
} from 'src/utils'

@Injectable()
export class MigrationInterface {
  constructor(
    private readonly migration: MigrationService,
    private readonly storage: StorageService,
  ) {}

  getSchema() {
    return this.migration.getSchema()
  }

  getColumn(name: string) {
    try {
      return this.migration.getColumn(name)
    } catch {
      return null
    }
  }

  addColumn(
    name: string,
    displayName: string,
    type: string,
    defaultValue: any,
    style: Style,
    options?: string[],
  ) {
    try {
      const column = this.createColumn(type, defaultValue, options)
      const newSchema = this.migration.addColumn(
        name,
        column,
        displayName,
        style,
      )
      this.storage.addColumn(name, defaultValue)
      return newSchema
    } catch {
      throw new ConflictException(
        `a column with the name "${name}" already exists`,
      )
    }
  }

  modifyColumn(
    name: string,
    data: {
      displayName?: string
      type?: string
      default?: any
      options?: string[]
      style?: Partial<Style>
    },
  ) {
    let column: Column
    try {
      if (data.type) {
        const { type, default: defaultValue, options } = data
        column = this.createColumn(type, defaultValue, options)
        const oldColumn = this.migration.getColumn(name)
        if (oldColumn.column.type == data.type) throw new Error()
        this.storage.changeType(
          name,
          oldColumn.column.type,
          data.type as Type,
          data.default,
        )
      }
      this.migration.modifyColumn(name, column, data.displayName, data.style)
    } catch {
      return null
    }
    return column
  }

  removeColumn(name: string) {
    try {
      const newSchema = this.migration.removeColumn(name)
      this.storage.removeColumn(name)
      return newSchema
    } catch {
      return null
    }
  }

  moveColumn(name: string, newIndex: number) {
    try {
      return this.migration.moveColumn(name, newIndex)
    } catch {
      return null
    }
  }

  toggleVisibility(name: string) {
    try {
      return this.migration.toggleColumnVisibility(name)
    } catch {
      return null
    }
  }

  toggleFrozen(name: string) {
    try {
      return this.migration.toggleFrozen(name)
    } catch {
      return null
    }
  }

  private createColumn(type: string, defaultValue: any, options?: string[]) {
    switch (type as Type) {
      case Type.Text:
        return {
          type: Type.Text,
          default: defaultValue as string,
        } as TextColumn
      case Type.Num:
        return { type: Type.Num, default: defaultValue as number } as NumColumn
      case Type.Boolean:
        return {
          type: Type.Boolean,
          default: defaultValue as boolean,
        } as BooleanColumn
      case Type.DropDownList:
        return {
          type: Type.DropDownList,
          default: defaultValue as string,
          options: options,
        } as DropDownColumn
      case Type.Date:
        return {
          type: Type.Date,
          default: new Date(defaultValue),
        } as DateColumn
    }
  }
}
