import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { AutoCast, TransformRangeDate } from '../decorators';
import { OrderType } from '../../common/enums';

export class QueryFilter {
  @IsOptional()
  @IsString()
  limit: string;

  @IsOptional()
  @IsString()
  page: string;

  @IsOptional()
  @IsString({ each: true })
  orderBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(OrderType)
  order?: OrderType = OrderType.DESC;

  @IsOptional()
  @IsString()
  rangeDateBy?: string = 'createdAt';

  @IsOptional()
  @TransformRangeDate()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsDate({ each: true })
  rangeDate?: [Date, Date];

  @IsOptional()
  @AutoCast()
  search?: any;

  @IsOptional()
  @IsString({ each: true })
  searchBy?: string | string[];
}
