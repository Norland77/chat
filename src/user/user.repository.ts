import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto';
import {IUser} from "./interfaces/IUser";
import {IUserRepository} from "./interfaces/user.repository.interface";
import { UserEditDto } from "./dto/user-edit.dto";

@Controller('user')
export class UserRepository implements IUserRepository{
  constructor(private readonly prismaService: PrismaService) {}

  async findUserById(Id: string): Promise<IUser | null> {
    return this.prismaService.user.findFirst({
      where: {
        id: Id,
      },
    });
  }

  async deleteUserById(Id: string): Promise<IUser> {
    return this.prismaService.user.delete({
      where: {
        id: Id,
      },
    });
  }

  async getUserByName(username: string, email: string): Promise<IUser | null> {
    return this.prismaService.user.findFirst({
      where: {
        AND: {username, email},
      },
    });
  }

  async createUser(dto: RegisterDto, hashedPassword: string): Promise<IUser> {
    return this.prismaService.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
      },
    });
  }

  async getAllUsers(): Promise<IUser[] | []> {
    return this.prismaService.user.findMany();
  }

  async editUserById(id: string, dto: UserEditDto) {
    return this.prismaService.user.update({
      where: {
        id
      },
      data: {
        email: dto.email,
        phone_number: dto.phone_number,
        description: dto.description,
      },
    })
  }

  async setAvatarById(id: string, avatar_url: string) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        avatar_url,
      },
    })
  }

  async getUserByEmail(email: string) {
    return this.prismaService.user.findFirst({
      where: {
        email,
      }
    })
  }
}
