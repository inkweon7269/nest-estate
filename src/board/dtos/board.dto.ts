import { Expose } from 'class-transformer';

export class BoardDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;
}
