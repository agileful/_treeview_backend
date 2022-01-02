import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { makeResponse } from 'src/utils'
import { MigrationInterface } from './migration.service'
import { AddColumnDto, ModifyColumnDto } from './validators/migration.dto'

@ApiTags('migration')
@Controller()
export class MigrationController {
  constructor(private readonly migration: MigrationInterface) {}

  @Get('schema')
  getSchema() {
    return makeResponse(this.migration.getSchema())
  }

  @Get('columns/:name')
  getColumn(@Param() params) {
    this.validateColumn(params.name)
    return makeResponse(this.migration.getColumn(params.name))
  }

  @Post('columns')
  addColumn(@Body() body: AddColumnDto) {
    return makeResponse(
      this.migration.addColumn(
        body.name,
        body.displayName,
        body.type,
        body.default,
        body.style,
        body.options,
      ),
    )
  }

  @Put('columns/:name')
  modifyColumn(@Param() params, @Body() body: ModifyColumnDto) {
    this.validateColumn(params.name)
    return makeResponse(this.migration.modifyColumn(params.name, body))
  }

  @Delete('columns/:name')
  removeColumn(@Param() params) {
    this.validateColumn(params.name)
    return makeResponse(this.migration.removeColumn(params.name))
  }

  @Get('columns/:name/toggle-visibility')
  toggleVisibility(@Param() params) {
    this.validateColumn(params.name)
    return makeResponse(this.migration.toggleVisibility(params.name))
  }

  @Get('columns/:name/toggle-frozen')
  toggleFrozen(@Param() params) {
    this.validateColumn(params.name)
    return makeResponse(this.migration.toggleFrozen(params.name))
  }

  private validateColumn(name: string) {
    if (!this.migration.getColumn(name))
      throw new BadRequestException(`column ${name} does not exist`)
  }
}
