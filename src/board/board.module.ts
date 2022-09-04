import { Module } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardEntity } from '../entities/board.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity]), AuthModule],
  providers: [BoardService],
  controllers: [BoardController],
})
export class BoardModule {}
