import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreateAtEntity } from './common/create-at.entity';
import { IsNotEmpty } from 'class-validator';
import { UserEntity } from './user.entity';
import { AptEntity } from './apt.entity';

@Entity()
export class AptUserBridgeEntity extends CreateAtEntity {
  @PrimaryColumn('int', { name: 'userId' })
  @IsNotEmpty()
  userId: number;

  @PrimaryColumn('int', { name: 'aptId' })
  @IsNotEmpty()
  aptId: number;

  @ManyToOne(() => UserEntity, (user) => user.aptUserBridges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne(() => AptEntity, (apt) => apt.aptUserBridges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'aptId', referencedColumnName: 'id' })
  apt: AptEntity;
}
