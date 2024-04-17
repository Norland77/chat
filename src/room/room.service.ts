import { Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { RoomCreateDto } from './dto/room-create.dto';
import {IRoom} from "./interfaces/IRoom";
import {IAllRooms} from "./interfaces/IAllRooms";

@Injectable()
export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async findRoomByName(name: string): Promise<IRoom> {
    return this.roomRepository.findRoomByName(name);
  }

  async createRoom(dto: RoomCreateDto): Promise<IRoom> {
    return this.roomRepository.createRoom(dto);
  }

  async findRoomById(id: string): Promise<IRoom> {
    return this.roomRepository.findRoomById(id);
  }

  async deleteRoom(id: string): Promise<IRoom> {
    return this.roomRepository.deleteRoom(id);
  }

  async getAllRooms(): Promise<IAllRooms[]> {
    return this.roomRepository.getAllRooms();
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
