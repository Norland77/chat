import { Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { RoomDto } from './dto/room.dto';
import { PersonalRoomDto } from './dto/personal-room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async findRoomByName(name: string) {
    return this.roomRepository.findRoomByName(name);
  }

  async createRoom(dto: RoomDto) {
    return this.roomRepository.createRoom(dto);
  }

  async findRoomById(id: string) {
    return this.roomRepository.findRoomById(id);
  }

  async deleteRoom(id: string) {
    return this.roomRepository.deleteRoom(id);
  }

  async getAllRooms() {
    return this.roomRepository.getAllRooms();
  }

  async addUserToRoom(roomId: string, userId: string) {
    return this.roomRepository.addUserToRoom(roomId, userId);
  }

  async addInviteLink(inviteLink: string, roomId: string) {
    return this.roomRepository.addInviteLink(inviteLink, roomId);
  }

  async leaveRoom(roomId: string, userId: string) {
    return this.roomRepository.leaveRoom(roomId, userId);
  }

  async createPersonal(dto: PersonalRoomDto) {
    return this.roomRepository.createPersonal(dto);
  }
}
