import {BadRequestException, Injectable} from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { RoomCreateDto } from './dto/room-create.dto';
import {IRoom} from "./interfaces/IRoom";
import {IAllRooms} from "./interfaces/IAllRooms";
import {IRoomService} from "./interfaces/room.service.interface";

@Injectable()
export class RoomService implements IRoomService{
  constructor(private readonly roomRepository: RoomRepository) {}

  async findRoomByName(name: string): Promise<void> {
    const room: IRoom | null = await this.roomRepository.findRoomByName(name);

    if (room) {
      throw new BadRequestException(`room with name: ${name} is already exist`);
    }
  }

  async createRoom(dto: RoomCreateDto): Promise<IRoom> {
    return this.roomRepository.createRoom(dto);
  }

  async findRoomById(id: string): Promise<IRoom> {
    const room: IRoom | null = await this.roomRepository.findRoomById(id);

    if (!room) {
      throw new BadRequestException(`room with id: ${id} is not exist`);
    }

    return room;
  }

  async deleteRoom(id: string): Promise<IRoom> {
    return this.roomRepository.deleteRoom(id);
  }

  async getAllRooms(): Promise<IAllRooms[]> {
    const room: IAllRooms[] | [] = await this.roomRepository.getAllRooms();

    if (room.length === 0) {
      throw new BadRequestException(`Rooms is not exist`);
    }

    return room;
  }

  async addUserToRoom(roomId: string, userId: string): Promise<IRoom> {
    return this.roomRepository.addUserToRoom(roomId, userId);
  }

  async addInviteLink(inviteLink: string, roomId: string): Promise<IRoom> {
    return this.roomRepository.addInviteLink(inviteLink, roomId);
  }

  async leaveRoom(roomId: string, userId: string): Promise<IRoom> {
    return this.roomRepository.leaveRoom(roomId, userId);
  }

  async createPersonal(dto: RoomCreateDto): Promise<IRoom> {
    return this.roomRepository.createPersonal(dto);
  }
}
