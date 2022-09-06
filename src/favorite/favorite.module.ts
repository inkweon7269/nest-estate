import { Module } from '@nestjs/common';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AptUserBridgeEntity } from '../entities/apt-user-bridge.entity';
import { AuthModule } from '../auth/auth.module';
import { AptDealEntity } from '../entities/apt-deal.entity';
import { AptEntity } from '../entities/apt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AptUserBridgeEntity, AptEntity,  AptDealEntity]),
    AuthModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class FavoriteModule {}
