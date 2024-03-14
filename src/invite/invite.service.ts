import { Injectable } from '@nestjs/common';
import { InviteRepository } from './invite.repository';
import { InviteDto } from './dto/invite.dto';

@Injectable()
export class InviteService {
  constructor(private readonly inviteRepository: InviteRepository) {}

  findInviteByRoom(roomId: string) {
    return this.inviteRepository.findInviteByRoom(roomId);
  }

  createInvite(dto: InviteDto) {
    return this.inviteRepository.createInvite(dto);
  }

  declineInvite(id: string) {
    return this.inviteRepository.declineInvite(id);
  }

  findRoomByToken(token: string) {
    return this.inviteRepository.findRoomByToken(token);
  }
}
