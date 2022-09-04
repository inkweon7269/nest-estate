import { CommonEntity } from './common/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { DealStatus } from '../crawling/crawling-status.enum';
import { AptEntity } from './apt.entity';
import { Type } from 'class-transformer';

@Entity()
export class AptDealEntity extends CommonEntity {
  @Column()
  @Type(() => Date)
  dealDate: Date;

  @Column()
  money: number;

  @Column()
  floor: string;

  @Column()
  dong: string;

  @Column()
  type: string;

  @Column()
  area: number;

  @Column()
  status: DealStatus;

  @ManyToOne((type) => AptEntity, (apt) => apt.deals)
  apt: AptEntity;
}
