import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { UserEntity } from './user.entity';
import { BoardStatus } from '../board/board-status.enum';

@Entity()
export class BoardEntity extends CommonEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: BoardStatus;

  @ManyToOne((type) => UserEntity, (user) => user.boards, { eager: false })
  user: UserEntity;
}
