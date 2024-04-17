import {BadRequestException, Injectable} from '@nestjs/common';
import { InviteRepository } from './invite.repository';
import { InviteDto } from './dto/invite.dto';
import {IInvite} from "./interfaces/IInvite";
import {IInviteService} from "./interfaces/invite.service.interface";

@Injectable()
export class InviteService implements IInviteService{
  constructor(private readonly inviteRepository: InviteRepository) {}

  async findInviteByRoom(roomId: string): Promise<void> {
    const invite = await this.inviteRepository.findInviteByRoom(roomId);

    if (invite) {
      throw new BadRequestException(`invite for this room is already exist`);
    }
  }

  async createInvite(dto: InviteDto): Promise<IInvite> {
    const invite = await this.inviteRepository.createInvite(dto);

    if (!invite) {
      throw new BadRequestException();
    }

    return invite
  }

  async findRoomByToken(token: string): Promise<IInvite> {
    const room = await this.inviteRepository.findRoomByToken(token);

    if (!room) {
      throw new BadRequestException(`room with token: ${token} is not exist`);
    }

    return room
  }
}
