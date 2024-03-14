import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from '../auth/dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findUserById(Id: string) {
    return this.userRepository.findUserById(Id);
  }

  async deleteUserById(Id: string) {
    return this.userRepository.deleteUserById(Id);
  }

  async getUserByName(username: string) {
    return this.userRepository.getUserByName(username);
  }

  async createUser(dto: RegisterDto) {
    return this.userRepository.createUser(dto);
  }

  async findUserByToken(token: string) {
    return this.userRepository.findUserByToken(token);
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }
}
