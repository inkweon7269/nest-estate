import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { SigninUserDto } from './dtos/signin-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
    });

    try {
      return await this.userRepo.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('가입되어 있는 이메일입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInUserDto: SigninUserDto) {
    const { email, password } = signInUserDto;
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 유저 토큰 생성 (Secret + Payload )
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다.');
    }
  }
}
