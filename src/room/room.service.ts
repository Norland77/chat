import { Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { RoomCreateDto } from './dto/room-create.dto';
import {IRoom} from "./interfaces/IRoom";
import {IAllRooms} from "./interfaces/IAllRooms";

@Injectable()
export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async findRoomByName(name: string): Promise<IRoom> {
    return await this.roomRepository.findRoomByName(name);
  }

  async createRoom(dto: RoomCreateDto): Promise<IRoom> {
    return await this.roomRepository.createRoom(dto);
  }

  async findRoomById(id: string): Promise<IRoom> {
    return await this.roomRepository.findRoomById(id);
  }

  async deleteRoom(id: string): Promise<IRoom> {
    return await this.roomRepository.deleteRoom(id);
  }

  async getAllRooms(): Promise<IAllRooms[]> {
    return await this.roomRepository.getAllRooms();
  }

  async addUserToRoom(roomId: string, userId: string): Promise<IRoom> {
    return await this.roomRepository.addUserToRoom(roomId, userId);
  }

  async addInviteLink(inviteLink: string, roomId: string): Promise<IRoom> {
    return await this.roomRepository.addInviteLink(inviteLink, roomId);
  }

  async leaveRoom(roomId: string, userId: string): Promise<IRoom> {
    return await this.roomRepository.leaveRoom(roomId, userId);
  }

  async createPersonal(dto: RoomCreateDto): Promise<IRoom> {
    return await this.roomRepository.createPersonal(dto);
  }
}
