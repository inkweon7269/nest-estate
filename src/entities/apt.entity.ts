import { CommonEntity } from './common/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { AptUserBridgeEntity } from './apt-user-bridge.entity';
import { AptDealEntity } from './apt-deal.entity';

@Entity()
export class AptEntity extends CommonEntity {
  @Column()
  buildAt: number;

  @Column()
  address: string;

  @Column()
  name: string;

  @Column()
  people: number;

  @Column()
  group: number;

  @OneToMany(() => AptDealEntity, (deal) => deal.apt, {
    cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  deals: AptDealEntity[];

  @OneToMany(() => AptUserBridgeEntity, (bridge) => bridge.apt)
  aptUserBridges: AptUserBridgeEntity[];
}
