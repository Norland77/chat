import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto';
import {IUser} from "./interfaces/IUser";

@Controller('user')
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserById(Id: string): Promise<IUser> {
    return await this.prismaService.user.findFirst({
      where: {
        id: Id,
      },
    });
  }

  async deleteUserById(Id: string): Promise<IUser> {
    return await this.prismaService.user.delete({
      where: {
        id: Id,
      },
    });
  }

  async getUserByName(username: string): Promise<IUser> {
    return await this.prismaService.user.findFirst({
      where: {
        AND: { username },
      },
    });
  }

  async createUser(dto: RegisterDto, hashedPassword: string): Promise<IUser> {
    return await this.prismaService.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
      },
    });
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.prismaService.user.findMany();
  }
}
