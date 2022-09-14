import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';
import { IsOptionalString } from '../../decorators/optional-string.decorator';
import { Type } from 'class-transformer';
import { DealStatus } from '../../crawling/crawling-status.enum';
import { IsOptionalEnum } from '../../decorators/optional-enum.decorator';

export class PaginationInput {
  @ApiProperty({ description: '조회할 page' })
  @IsNumber()
  page: number;

  @ApiProperty({ description: '최대 조회 건수' })
  @IsNumber()
  limit: number;
}

export class SearchPageInput extends PaginationInput {
  @ApiProperty({ description: '검색어, 없을시 빈문자', required: false })
  @IsOptionalString(0, 127)
  search?: string;
}

export class RangePageInput extends SearchPageInput {
  @ApiProperty({ description: '조회 시작 일', required: false })
  @IsOptionalString(0, 127)
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ description: '조회 시작 일', required: false })
  @IsOptionalString(0, 127)
  @Type(() => Date)
  endDate?: Date;
}

export class AptPageInput extends RangePageInput {
  @ApiProperty({ description: '아파트 ID' })
  @IsNumber()
  apt?: number;

  @IsString()
  ids?: string;

  @ApiProperty({ description: '아파트 거래 조회' })
  @IsOptionalEnum(DealStatus)
  status?: DealStatus;
}
