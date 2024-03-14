import { Module } from '@nestjs/common';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { InviteRepository } from './invite.repository';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';

@Module({
  controllers: [InviteController, InviteRepository],
  providers: [InviteService, InviteRepository],
  imports: [UserModule, RoomModule],
})
export class InviteModule {}
