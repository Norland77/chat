import {BadRequestException, Injectable} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { RegisterDto } from '../auth/dto';
import { genSaltSync, hash } from 'bcrypt';
import {IUser} from "./interfaces/IUser";
import { UserEditDto } from "./dto/user-edit.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async findUserById(Id: string): Promise<IUser> {
    const user: IUser | null =  await this.userRepository.findUserById(Id);

    if (!user) {
      throw new BadRequestException(`user is not exist`);
    }

    return user;
  }

  async deleteUserById(Id: string): Promise<IUser> {
    return this.userRepository.deleteUserById(Id);
  }

  async getUserByName(username: string, email: string, type?: string): Promise<IUser> {
    const user: IUser | null = await this.userRepository.getUserByName(username, email);

    if (type === 'login') {
      if (!user) {
        throw new BadRequestException(`not found user with name: ${username}`)
      }
      return  user;
    } else if (type === 'reg') {
      if (user) {
        throw new BadRequestException(`user with username: ${username} is already exist`)
      }
      return  user;
    }
  }

  async createUser(dto: RegisterDto): Promise<IUser> {
    if (dto.password === '' || dto.password === undefined) {
      throw new BadRequestException(`Password is empty`);
    }
    const hashedPassword: string = await hash(dto.password, genSaltSync(10));

    const user = await this.userRepository.createUser(dto, hashedPassword);

    if (!user) {
      throw new BadRequestException(
        `Can't register user with data ${JSON.stringify(dto)}`,
      );
    }

    return user
  }

  async getAllUsers(): Promise<IUser[]> {
    const user: IUser[] | [] = await this.userRepository.getAllUsers();

    if (user.length === 0) {
      throw new BadRequestException(`users not found`)
    }

    return user
  }

  async editUserById(id: string, dto: UserEditDto) {
    return this.userRepository.editUserById(id, dto);
  }

  async setAvatarById(id: string, avatar_url: string) {
    return this.userRepository.setAvatarById(id, avatar_url);
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new BadRequestException(`user with email: ${email} is not exist`);
    }

    return user;
  }
}
