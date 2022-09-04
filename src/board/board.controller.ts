import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dtos/create-board-dto';
import { GetUser } from '../decorators/get-user.decorator';
import { UserEntity } from '../entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Serialize } from '../interceptors/serialize.interceptor';
import { BoardDto } from './dtos/board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { BoardStatus } from './board-status.enum';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  RangePageInput,
  SearchPageInput,
} from '../common/dtos/input-value.dto';

@Controller('board')
@UseGuards(AuthGuard())
export class BoardController {
  constructor(private boardService: BoardService) {}

  @ApiOperation({
    summary: '전체 게시물 조회',
    description: '전체 게시물 조회',
  })
  @ApiOkResponse({ description: '조회 성공' })
  @Get()
  getAllBoards(@Query() input: RangePageInput, @GetUser() user: UserEntity) {
    return this.boardService.getAllBoards(user, input);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @Serialize(BoardDto)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: UserEntity,
  ) {
    return this.boardService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number, @GetUser() user: UserEntity) {
    return this.boardService.getBoardById(id, user);
  }

  @Patch('/:id')
  updateBoard(
    @Param('id') id: number,
    @GetUser() user: UserEntity,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return this.boardService.updateBoard(id, user, status);
  }

  @Delete('/:id')
  deleteBoard(@Param('id') id: number, @GetUser() user: UserEntity) {
    return this.boardService.deleteBoard(id, user);
  }
}
