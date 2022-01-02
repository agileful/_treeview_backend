import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { Column, Schema, Style, Type } from 'src/utils'

@Injectable()
export class MigrationService {
  private schemaChanged = false
  private storagePath = 'repository'
  private schemaFile = `${this.storagePath}/schema.json`
  private schema: Schema = {}

  constructor() {
    if (existsSync(this.schemaFile))
      this.schema = JSON.parse(readFileSync(this.schemaFile, 'utf8'))
    else if (!existsSync(this.storagePath))
      mkdirSync(this.storagePath, { recursive: true })
  }

  getSchema() {
    return JSON.parse(JSON.stringify(this.schema))
  }

  getColumn(name: string) {
    if (!this.schema[name]) throw new Error()
    return this.schema[name]
  }

  addColumn(name: string, column: Column, displayName: string, style: Style) {
    if (this.schema[name]) throw new Error()
    this.schema[name] = Object.freeze({
      column,
      visible: true,
      frozen: false,
      displayName,
      index: Object.keys(this.schema).length + 1,
      style,
    })
    this.schemaChanged = true
    return this.schema
  }

  modifyColumn(
    name: string,
    column: Column,
    displayName?: string,
    style?: Partial<Style>,
  ) {
    if (!this.schema[name]) throw new Error()
    this.schema[name] = Object.freeze({
      column: column || this.schema[name].column,
      visible: this.schema[name].visible,
      frozen: this.schema[name].frozen,
      displayName: displayName || this.schema[name].displayName,
      index: this.schema[name].index,
      style: { ...this.schema[name].style, ...style },
    })
    this.schemaChanged = true
    return this.schema
  }

  removeColumn(name: string) {
    if (!this.schema[name]) throw new Error()
    delete this.schema[name]
    this.schemaChanged = true
    return this.schema
  }

  toggleColumnVisibility(name: string) {
    if (!this.schema[name]) throw new Error()
    this.schema[name].visible = !this.schema[name].visible
    this.schemaChanged = true
    return this.schema
  }

  toggleFrozen(name: string) {
    if (!this.schema[name]) throw new Error()
    this.schema[name].frozen = !this.schema[name].frozen
    this.schemaChanged = true
    return this.schema
  }

  moveColumn(name: string, newIndex: number) {
    if (!this.schema[name]) throw new Error()
    if (newIndex < 1 || newIndex > Object.keys(this.schema).length)
      throw new Error()

    const oldIndex = this.schema[name].index
    if (oldIndex == newIndex) return

    const min = oldIndex < newIndex ? oldIndex : newIndex
    const max = oldIndex > newIndex ? oldIndex : newIndex
    const additive = min == oldIndex ? -1 : 1

    Object.keys(this.schema).forEach(key => {
      if (this.schema[key].index < min) return
      if (this.schema[key].index > max) return
      if (this.schema[key].index == oldIndex) {
        this.schema[key].index = newIndex
        return
      }
      this.schema[key].index = this.schema[key].index + additive
    })
    this.schemaChanged = true
    return this.schema
  }

  @Cron('*/5 * * * * *')
  saveSchema() {
    if (this.schemaChanged) {
      writeFileSync(
        this.schemaFile,
        JSON.stringify(this.schema, null, 2),
        'utf8',
      )
      this.schemaChanged = false
    }
  }
}
