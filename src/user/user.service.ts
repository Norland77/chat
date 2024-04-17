import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from '../auth/dto';
import { genSaltSync, hash } from 'bcrypt';
import {IUser} from "./interfaces/IUser";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findUserById(Id: string): Promise<IUser> {
    return this.userRepository.findUserById(Id);
  }

  async deleteUserById(Id: string): Promise<IUser> {
    return this.userRepository.deleteUserById(Id);
  }

  async getUserByName(username: string): Promise<IUser> {
    return this.userRepository.getUserByName(username);
  }

  private async hashPassword(password: string | undefined): Promise<string> {
    if (!password) {
      return '';
    }
    return hash(password, genSaltSync(10));
  }

  async createUser(dto: RegisterDto): Promise<IUser> {
    const hashedPassword: string = await this.hashPassword(dto.password);

    return this.userRepository.createUser(dto, hashedPassword);
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepository.getAllUsers();
  }
}
