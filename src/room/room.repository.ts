import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomDto } from './dto/room.dto';
import { PersonalRoomDto } from './dto/personal-room.dto';

@Controller('room')
export class RoomRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findRoomByName(name: string) {
    return this.prismaService.room.findFirst({
      where: {
        name,
      },
    });
  }

  createRoom(dto: RoomDto) {
    return this.prismaService.room.create({
      data: {
        name: dto.name,
        ownerId: dto.ownerId,
        isPrivate: dto.isPrivate,
        users: {
          connect: {
            id: dto.ownerId,
          },
        },
      },
    });
  }

  async findRoomById(id: string) {
    return this.prismaService.room.findFirst({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });
  }

  deleteRoom(id: string) {
    return this.prismaService.room.delete({
      where: {
        id,
      },
    });
  }

  getAllRooms() {
    return this.prismaService.room.findMany({
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  addUserToRoom(roomId: string, userId: string) {
    console.log(userId);
    return this.prismaService.room.update({
      where: {
        id: roomId,
      },
      data: {
        users: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  addInviteLink(inviteLink: string, roomId: string) {
    console.log(inviteLink);
    return this.prismaService.room.update({
      where: {
        id: roomId,
      },
      data: {
        inviteLink: inviteLink,
      },
    });
  }

  leaveRoom(roomId: string, userId: string) {
    return this.prismaService.room.update({
      where: {
        id: roomId,
      },
      data: {
        users: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  createPersonal(dto: PersonalRoomDto) {
    return this.prismaService.room.create({
      data: {
        name: dto.name,
        isPersonal: true,
        isPrivate: true,
        users: {
          connect: [{ id: dto.firstUserId }, { id: dto.secondUserId }],
        },
      },
    });
  }
}
