import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { SigninUserDto } from './dtos/signin-user.dto';
import { GetUser } from '../decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @Serialize(UserDto)
  signUp(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) signInUserDto: SigninUserDto) {
    return this.authService.signIn(signInUserDto);
  }

  @Get('/profile')
  @UseGuards(AuthGuard())
  @Serialize(UserDto)
  getProfile(@GetUser() user: UserEntity) {
    return user;
  }
}
