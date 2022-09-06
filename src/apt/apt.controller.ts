import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AptService } from './apt.service';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import { UserEntity } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AptPageInput, RangePageInput } from '../common/dtos/input-value.dto';

@Controller('apt')
@UseGuards(AuthGuard())
export class AptController {
  constructor(private aptService: AptService) {}

  @ApiOperation({
    summary: '전체 아파트 조회',
    description: '전체 아파트 조회',
  })
  @ApiOkResponse({ description: '조회 성공' })
  @Get('/simple')
  getAptSimple() {
    return this.aptService.getAptSimple();
  }

  @ApiOperation({
    summary: '전체 아파트 거래 조회',
    description: '전체 아파트 거래 조회',
  })
  @ApiOkResponse({ description: '조회 성공' })
  @Get('/deals')
  getAllAptDeals(@Query() input: AptPageInput) {
    return this.aptService.getAllAptDeals(input);
  }
}
