import { IsNotEmpty, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { BoardEntity } from '../../entities/board.entity';

export class CreateBoardDto extends PickType(BoardEntity, [
  'title',
  'description',
]) {}
