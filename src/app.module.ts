import { Module } from '@nestjs/common';
import { CrawlingModule } from './crawling/crawling.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { BoardModule } from './board/board.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { FavoriteModule } from './favorite/favorite.module';
import { AptModule } from './apt/apt.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    CrawlingModule,
    AuthModule,
    BoardModule,
    FavoriteModule,
    AptModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }
  ],
})
export class AppModule {}
