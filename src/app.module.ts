import { Module } from '@nestjs/common';
import { MessageModule } from './message/message.module';
import { PrismaModule } from './prisma/prisma.module';
import { RoomModule } from './room/room.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    MessageModule,
    PrismaModule,
    RoomModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
