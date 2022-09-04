import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from '../entities/board.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dtos/create-board-dto';
import { UserEntity } from '../entities/user.entity';
import { BoardStatus } from './board-status.enum';
import { RangePageInput } from '../common/dtos/input-value.dto';
import { getSkip } from '../common/common.function';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardRepo: Repository<BoardEntity>,
  ) {}

  async getAllBoards(user: UserEntity, { page, limit }: RangePageInput) {
    const [list, count] = await this.boardRepo.findAndCount({
      select: {
        createAt: true,
        id: true,
        title: true,
        description: true,
        status: true,
        user: {
          id: true,
          email: true,
        },
      },
      relations: {
        user: true,
      },
      where: {
        user: {
          id: user.id,
        },
      },
      ...getSkip(page, limit),
      order: {
        createAt: 'desc',
      },
    });

    return {
      list,
      count,
    };
  }

  async createBoard(createBoardDto: CreateBoardDto, user: UserEntity) {
    const { title, description } = createBoardDto;
    const board = this.boardRepo.create({
      title,
      description,
      status: BoardStatus.PRIVATE,
      user,
    });

    await this.boardRepo.save(board);

    return board;
  }

  async getBoardById(boardId: number, user: UserEntity) {
    const found = await this.boardRepo.findOne({
      select: {
        createAt: true,
        updateAt: true,
        id: true,
        title: true,
        description: true,
        status: true,
        user: {
          id: true,
          email: true,
        },
      },
      relations: {
        user: true,
      },
      where: {
        id: boardId,
        user: {
          id: user.id,
        },
      },
    });

    if (!found) {
      throw new NotFoundException(`해당 게시물을 찾을 수 없습니다.`);
    }

    return found;
  }

  async updateBoard(boardId: number, user: UserEntity, status: BoardStatus) {
    const board = await this.getBoardById(boardId, user);

    board.status = status;
    await this.boardRepo.save(board);

    return board;
  }

  async deleteBoard(boardId: number, user: UserEntity) {
    const board = await this.getBoardById(boardId, user);

    await this.boardRepo.delete(board.id);
  }
}
