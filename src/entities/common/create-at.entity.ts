import { BaseEntity, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAtEntity extends BaseEntity {
  @ApiProperty({ name: 'createAt', example: new Date() })
  @CreateDateColumn({ type: 'timestamp without time zone' })
  createAt: Date;
}