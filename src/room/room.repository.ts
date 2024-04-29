import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomCreateDto } from './dto/room-create.dto';
import {IRoom} from "./interfaces/IRoom";
import {IAllRooms} from "./interfaces/IAllRooms";
import {IRoomRepository} from "./interfaces/room.repository.interface";

@Controller('room')
export class RoomRepository implements IRoomRepository{
  constructor(private readonly prismaService: PrismaService) {}

  async findRoomByName(name: string): Promise<IRoom | null> {
    return this.prismaService.room.findFirst({
      where: {
        name,
      },
    });
  }

  async createRoom(dto: RoomCreateDto): Promise<IRoom> {
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
        avatar_url: dto.avatar_url,
      },
    });
  }

  async findRoomById(id: string): Promise<IRoom | null> {
    return this.prismaService.room.findFirst({
      where: {
        id,
      },
      include: {
        users: true,
      },
    });
  }

  async deleteRoom(id: string): Promise<IRoom> {
    return this.prismaService.room.delete({
      where: {
        id,
      },
    });
  }

  async getAllRooms(): Promise<IAllRooms[] | []> {
    return this.prismaService.room.findMany({
      include: {
        users: true,
        messages: {
          include: {
            files: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
  }

  async addUserToRoom(roomId: string, userId: string): Promise<IRoom> {
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

  async addInviteLink(inviteLink: string, roomId: string): Promise<IRoom> {
    return this.prismaService.room.update({
      where: {
        id: roomId,
      },
      data: {
        inviteLink: inviteLink,
      },
    });
  }

  async leaveRoom(roomId: string, userId: string): Promise<IRoom> {
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

  async createPersonal(dto: RoomCreateDto): Promise<IRoom> {
    return this.prismaService.room.create({
      data: {
        name: dto.name,
        isPersonal: true,
        isPrivate: true,
        users: {
          connect: [{ id: dto.firstUserId }, { id: dto.secondUserId }],
        },
        firstUserId: dto.firstUserId,
        secondUserId: dto.secondUserId,
      },
    });
  }
}
