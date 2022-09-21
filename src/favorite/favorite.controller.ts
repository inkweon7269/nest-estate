import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { GetUser } from '../decorators/get-user.decorator';
import { UserEntity } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { AptPageInput, RangePageInput } from '../common/dtos/input-value.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('favorite')
@UseGuards(AuthGuard())
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @ApiOperation({
    summary: '전체 즐겨찾기 조회',
    description: '전체 즐겨찾기 조회',
  })
  @ApiOkResponse({ description: '조회 성공' })
  @Get('/simple')
  getFavoriteSimple(@GetUser() user: UserEntity) {
    return this.favoriteService.getFavoriteSimple(user);
  }

  @ApiOperation({
    summary: '즐겨찾기 아파트 조회',
    description: '즐겨찾기 아파트 조회',
  })
  @ApiOkResponse({ description: '조회 성공' })
  @Get()
  getAllFavorites(
    @Query() input: AptPageInput,
    // @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    // ids: number[],
    @GetUser() user: UserEntity,
  ) {
    // const result = {
    //   ...input,
    //   ids,
    // };
    return this.favoriteService.getAllFavorites(input, user);
  }

  @ApiOperation({
    summary: '즐겨찾기 아파트 차트 조회',
    description: '즐겨찾기 아파트 차트 조회',
  })
  @ApiOkResponse({ description: '조회 성공' })
  @Get('/charts')
  getAllChartFavorites(
    @Query() input: AptPageInput,
    @GetUser() user: UserEntity,
  ) {
    return this.favoriteService.getAllChartFavorites(input, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createFavorite(@Body('id') aptId: number, @GetUser() user: UserEntity) {
    return this.favoriteService.createFavorite(aptId, user);
  }

  @Delete('/:id')
  deleteFavorite(@Param('id') aptId: number, @GetUser() user: UserEntity) {
    return this.favoriteService.deleteFavorite(aptId, user);
  }
}
