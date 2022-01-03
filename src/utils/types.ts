export enum Type {
  Text = 'Text',
  Num = 'Num',
  Boolean = 'Boolean',
  Date = 'Date',
  DropDownList = 'DropDownList',
}

export interface Column {
  type: Type
}

export interface TextColumn extends Column {
  default: string
}

export interface DropDownColumn extends TextColumn {
  options: string[]
}

export interface DateColumn extends Column {
  default: Date
}

export interface NumColumn extends Column {
  default: number
}

export interface BooleanColumn extends Column {
  default: boolean
}

export enum Alignment {
  right = 'right',
  left = 'left',
}

export interface Style {
  fontSize: number
  fontColor: string
  backgroundColor: string
  alignment: Alignment
  textWrap: boolean
  minColumnWidth: number
  width: number
}

export interface Schema {
  [_: string]: {
    column: Column
    displayName: string
    visible: boolean
    frozen: boolean
    index: number
    style: Style
  }
}

export interface Data {
  [_: string]: number | string | boolean | Date
}

export interface Row {
  rowId: number
  data: Data
  parent: number
}
