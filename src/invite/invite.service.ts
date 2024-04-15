import { Injectable } from '@nestjs/common';
import { InviteRepository } from './invite.repository';
import { InviteDto } from './dto/invite.dto';
import {IInvite} from "./interfaces/IInvite";

@Injectable()
export class InviteService {
  constructor(private readonly inviteRepository: InviteRepository) {}

  async findInviteByRoom(roomId: string): Promise<IInvite> {
    return await this.inviteRepository.findInviteByRoom(roomId);
  }

  async createInvite(dto: InviteDto): Promise<IInvite> {
    return await this.inviteRepository.createInvite(dto);
  }

  async findRoomByToken(token: string): Promise<IInvite> {
    return await this.inviteRepository.findRoomByToken(token);
  }
}
