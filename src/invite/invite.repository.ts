import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteDto } from './dto/invite.dto';

@Controller('invite')
export class InviteRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findInviteByRoom(roomId: string) {
    return this.prismaService.inviteList.findFirst({
      where: {
        roomId,
      },
    });
  }

  async createInvite(dto: InviteDto) {
    return this.prismaService.inviteList.create({
      data: {
        roomId: dto.roomId,
        accept: dto.accept,
        token: dto.token,
      },
    });
  }

  async findRoomByToken(token: string) {
    return this.prismaService.inviteList.findFirst({
      where: {
        token,
      },
      include: {
        room: true,
      },
    });
  }
}
