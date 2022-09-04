import { ApiProperty } from '@nestjs/swagger';

export class OutputValueDto {
  @ApiProperty({ example: 'false', description: 'API결과' })
  result: boolean;

  @ApiProperty({
    example: '100',
    description: '응답 성공 여부',
    required: false,
  })
  code?: number;

  @ApiProperty({ example: 'message', description: '메시지', required: false })
  message?: string;

  @ApiProperty({ description: '전체 페이지' })
  totalPage?: number;

  @ApiProperty({ description: '모든 값' })
  totalResult?: number;
}
