import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InviteDto } from './dto/invite.dto';

@Controller('invite')
export class InviteRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findInviteByRoom(roomId: string) {
    return this.prismaService.inviteList.findFirst({
      where: {
        roomId,
      },
    });
  }

  createInvite(dto: InviteDto) {
    return this.prismaService.inviteList.create({
      data: {
        roomId: dto.roomId,
        accept: dto.accept,
        token: dto.token,
      },
    });
  }

  declineInvite(id: string) {
    return this.prismaService.inviteList.update({
      where: {
        id,
      },
      data: {
        accept: false,
      },
    });
  }

  findRoomByToken(token: string) {
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
