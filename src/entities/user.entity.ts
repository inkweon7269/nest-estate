import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { CommonEntity } from './common/common.entity';
import { BoardEntity } from './board.entity';
import { AptUserBridgeEntity } from './apt-user-bridge.entity';

@Entity()
@Unique(['email'])
export class UserEntity extends CommonEntity {
  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany((type) => BoardEntity, (board) => board.user, { eager: false })
  boards: BoardEntity[];

  @OneToMany(() => AptUserBridgeEntity, (bridge) => bridge.apt)
  aptUserBridges: AptUserBridgeEntity[];
}
