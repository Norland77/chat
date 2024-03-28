import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from '../auth/dto';
import { genSaltSync, hashSync } from 'bcrypt';

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

  private hashPassword(password: string | undefined) {
    if (!password) {
      return '';
    }
    return hashSync(password, genSaltSync(10));
  }

  async createUser(dto: RegisterDto) {
    const hashedPassword = this.hashPassword(dto.password);

    return this.userRepository.createUser(dto, hashedPassword);
  }

  async findUserByToken(token: string) {
    return this.userRepository.findUserByToken(token);
  }

  async getAllUsers() {
    return this.userRepository.getAllUsers();
  }
}
