import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../entities/user.entity';

export class SigninUserDto extends PickType(UserEntity, [
  'email',
  'password',
]) {}
