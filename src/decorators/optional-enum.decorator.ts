import { applyDecorators } from '@nestjs/common';
import { IsEnum, IsOptional, ValidateIf } from 'class-validator';

export function IsOptionalEnum(e: { [s: number]: string }) {
  return applyDecorators(
    IsOptional(),
    ValidateIf((e) => e === ''),
    IsEnum(e, {}),
  );
}