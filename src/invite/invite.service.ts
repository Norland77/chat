import { Injectable } from '@nestjs/common';
import { InviteRepository } from './invite.repository';
import { InviteDto } from './dto/invite.dto';

@Injectable()
export class InviteService {
  constructor(private readonly inviteRepository: InviteRepository) {}

  async findInviteByRoom(roomId: string) {
    return this.inviteRepository.findInviteByRoom(roomId);
  }

  async createInvite(dto: InviteDto) {
    return this.inviteRepository.createInvite(dto);
  }

  async findRoomByToken(token: string) {
    return this.inviteRepository.findRoomByToken(token);
  }
}
