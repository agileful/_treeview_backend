import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { StorageService } from 'src/storage/storage.service'
import { makeResponse } from 'src/utils'
import { StorageInterface } from './storage.service'

@ApiTags('storage')
@Controller()
export class StorageController {
  constructor(
    private readonly storage: StorageService,
    private readonly service: StorageInterface,
  ) {}

  @Get()
  getData(@Query() query) {
    const page = query.page ? parseInt(query.page) : undefined
    const limit = query.limit ? parseInt(query.limit) : undefined
    return makeResponse(this.storage.getData(page, limit))
  }

  // @Post()
  // getDataWithExtra(@Query() query, @Body() body) {
  //   const page = query.page ? parseInt(query.page) : undefined
  //   const limit = query.limit ? parseInt(query.limit) : undefined
  //   return makeResponse(this.storage.getData(page, limit, body))
  // }

  @Post('add-row/:index/:parent?')
  addRow(@Body() body, @Param() params) {
    let parent
    if (params.parent) parent = parseInt(params.parent)
    const index = parseInt(params.index)
    try {
      const transformed = this.service.validateAndTransformData(body)
      return makeResponse(this.storage.addRow(transformed, index, parent))
    } catch {
      return makeResponse(null)
    }
  }

  @Get('rows/:id/move/:after?')
  moveRow(@Param() params) {
    const id = parseInt(params.id)
    let after
    if (params.after) after = parseInt(params.after)
    try {
      return makeResponse(this.storage.moveRow(id, after))
    } catch {
      return makeResponse(null)
    }
  }

  @Get('rows/:id/make-child-of/:parent')
  selectParent(@Param() params) {
    const id = parseInt(params.id)
    const parent = parseInt(params.parent)
    try {
      return makeResponse(this.storage.selectParent(id, parent))
    } catch {
      return makeResponse(null)
    }
  }

  @Get('rows/:id/make-orphan')
  makeOrphan(@Param() params) {
    const id = parseInt(params.id)
    try {
      return makeResponse(this.storage.makeOrphan(id))
    } catch {
      return makeResponse(null)
    }
  }

  @Delete('rows/:id')
  removeRow(@Param() params) {
    const id = parseInt(params.id)
    try {
      return makeResponse(this.storage.removeRow(id))
    } catch {
      return makeResponse(null)
    }
  }
}
