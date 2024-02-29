import { Injectable } from '@nestjs/common';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(private readonly roomRepository: RoomRepository) {}

  async findRoomByName(name: string) {
    return this.roomRepository.findRoomByName(name);
  }

  createRoom(name: string) {
    return this.roomRepository.createRoom(name);
  }

  async findRoomById(id: string) {
    return this.roomRepository.findRoomById(id);
  }

  deleteRoom(id: string) {
    return this.roomRepository.deleteRoom(id);
  }

  getAllRooms() {
    return this.roomRepository.getAllRooms();
  }
}
