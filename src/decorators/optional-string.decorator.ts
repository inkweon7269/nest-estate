import { applyDecorators } from '@nestjs/common';
import { IsOptional, IsString, Length } from 'class-validator';

export const IsOptionalString = (min: number, max: number) => {
  return applyDecorators(IsOptional(), IsString(), Length(min, max));
}