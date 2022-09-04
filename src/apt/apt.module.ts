import { Module } from '@nestjs/common';
import { AptService } from './apt.service';
import { AptController } from './apt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AptEntity } from '../entities/apt.entity';
import { AptDealEntity } from '../entities/apt-deal.entity';
import { AptUserBridgeEntity } from '../entities/apt-user-bridge.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AptEntity, AptDealEntity, AptUserBridgeEntity]),
    AuthModule,
  ],
  providers: [AptService],
  controllers: [AptController],
})
export class AptModule {}
