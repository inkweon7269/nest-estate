import { CreateAtEntity } from './create-at.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CommonEntity extends CreateAtEntity {
  @ApiProperty({ name: 'id', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ name: 'updateAt', example: new Date() })
  @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
  updateAt: Date;

  @DeleteDateColumn({ type: 'timestamp without time zone' })
  deleteAt: Date;
}
