import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import { Type as classType } from 'class-transformer'
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidateNested,
} from 'class-validator'
import { Alignment, Type } from 'src/utils'
import { ProperDefault } from './proper-default'

export class StyleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  fontSize: number

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^([a-zA-Z0-9]{3,4}){1,2}$/)
  fontColor: string

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^([a-zA-Z0-9]{3,4}){1,2}$/)
  backgroundColor: string

  @ApiProperty({ required: false, enum: Object.keys(Alignment) })
  @IsOptional()
  @IsIn(Object.keys(Alignment))
  alignment: Alignment

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minColumnWidth: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  width: number

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  textWrap: boolean
}

export class AddColumnDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty({ enum: Object.keys(Type) })
  @IsIn(Object.keys(Type))
  type: string

  @ApiProperty({ required: false })
  @IsOptional()
  options: string[]

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
  })
  @Validate(ProperDefault)
  default: string | number | boolean

  @ApiProperty({ required: false, type: StyleDto })
  @IsOptional()
  @ValidateNested()
  @classType(() => StyleDto)
  style: StyleDto

  @ApiProperty()
  @IsString()
  displayName: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  index: number
}

export class ModifyColumnDto extends PartialType(
  OmitType(AddColumnDto, ['name']),
) {}
