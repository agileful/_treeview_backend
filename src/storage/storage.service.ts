import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { comparators, converters, Data, Row, Type } from 'src/utils'

@Injectable()
export class StorageService {
  private dataChanged = false
  private storagePath = 'repository'
  private dataFile = `${this.storagePath}/data.json`
  private data: Row[] = []
  private lastRowId: number = 0

  constructor() {
    if (existsSync(this.dataFile)) {
      this.data = JSON.parse(readFileSync(this.dataFile, 'utf8'))
      if (this.data.length > 0)
        this.lastRowId = Math.max(...this.data.map(r => r.rowId))
      else this.lastRowId = 0
    } else if (!existsSync(this.storagePath))
      mkdirSync(this.storagePath, { recursive: true })
  }

  getData(
    page?: number,
    limit?: number,
    extra?: {
      filter?: { [_: string]: any }
      sort?: { [_: string]: 'asc' | 'desc' }
    },
  ) {
    let tempData = [...this.data]

    if (extra?.filter) {
      tempData = tempData.filter(r => {
        let flag = true
        Object.keys(extra.filter).forEach(key => {
          if (r.data[key] != extra.filter[key]) flag = false
        })
        return flag
      })
      tempData = [
        ...tempData,
        ...this.data.filter(r => tempData.map(t => t.parent).includes(r.rowId)),
      ]
    }

    if (extra?.sort) {
      tempData.sort((a, b) => {
        return Object.keys(extra.sort).reduce((flag, key) => {
          let result: number
          if (key == 'rowId') result = comparators.number(a.rowId, b.rowId)
          else
            result = comparators[typeof a.data[key]](a.data[key], b.data[key])
          if (flag == 0) return extra.sort[key] == 'asc' ? result : -1 * result
          return flag
        }, 0)
      })
    }

    let data = tempData.map(r => ({
      rowId: r.rowId,
      parent: r.parent || null,
      children: [],
      ...r.data,
    }))

    if (page && limit) {
      data = data.slice((page - 1) * limit, limit + 1)
      let more = false
      if (data.length > limit) {
        more = true
        data.splice(-1)
      }
      return { data, more }
    }

    return data
  }

  addRow(data: Data, parent?: number) {
    if (parent && !this.data.find(r => r.rowId == parent)) throw new Error()
    this.data.push({ rowId: ++this.lastRowId, data, parent })
    this.dataChanged = true
  }

  moveRow(row: number, after?: number) {
    const oldIndex = this.data.findIndex(r => r.rowId == row)
    let newIndex = 0
    if (after) {
      newIndex = this.data.findIndex(r => r.rowId == after) + 1
      if (oldIndex == -1 || newIndex == 0) throw new Error()
    }
    const [temp] = this.data.splice(oldIndex, 1)
    this.data.splice(newIndex, 0, temp)
    this.dataChanged = true
  }

  selectParent(row: number, parent: number) {
    const r = this.data.find(r => r.rowId == row)
    console.log(r)
    console.log(this.data.find(r => r.rowId == parent))
    if (!r || !this.data.find(r => r.rowId == parent)) throw new Error()
    r.parent = parent
    this.dataChanged = true
  }

  makeOrphan(row: number) {
    const r = this.data.find(r => r.rowId == row)
    if (!r) throw new Error()
    r.parent = undefined
    this.dataChanged = true
  }

  removeRow(row: number) {
    if (this.data.length == 0) return
    this.data.splice(
      this.data.findIndex(r => r.rowId == row),
      1,
    )
    this.dataChanged = true
  }

  addColumn(name: string, defaultValue: any) {
    if (this.data.length == 0) return
    this.data = this.data.map(r => {
      if (r.data[name]) return r
      r.data[name] = defaultValue
      return r
    })
    this.dataChanged = true
  }

  removeColumn(name: string) {
    if (this.data.length == 0) return
    this.data.forEach(r => delete r.data[name])
    this.dataChanged = true
  }

  changeType(name: string, oldType: Type, newType: Type, defaultValue: any) {
    if (this.data.length == 0) return
    const convert = converters[`${oldType}|>${newType}`]
    this.data = this.data.map(r => {
      const converted = convert(r.data[name])
      r.data[name] = converted || defaultValue
      return r
    })
    this.dataChanged = true
  }

  private familyTree(data: any[], tree = [], depth = 0) {
    if (data.length == 0) return tree

    const roots = data.filter(r => !r.parent)
    if (roots.length > 0) {
      tree.push(roots)
      const next = data.filter(r => r.parent)
      return this.familyTree(next, tree)
    }

    const current = data.filter(r => tree[depth].some(p => p.rowId == r.parent))
    depth += 1
    tree[depth] = current
    const next = data.filter(r => !current.some(rc => rc.rowId == r.rowId))
    return this.familyTree(next, tree, depth)
  }

  @Cron('*/5 * * * * *')
  saveSchema() {
    if (this.dataChanged) {
      writeFileSync(this.dataFile, JSON.stringify(this.data, null, 2), 'utf8')
      this.dataChanged = false
    }
  }
}
