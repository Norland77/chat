import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto';

@Controller('user')
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserById(Id: string) {
    return this.prismaService.user.findFirst({
      where: {
        id: Id,
      },
    });
  }

  async deleteUserById(Id: string) {
    return this.prismaService.user.delete({
      where: {
        id: Id,
      },
    });
  }

  async getUserByName(username: string) {
    return this.prismaService.user.findFirst({
      where: {
        AND: { username },
      },
    });
  }

  async createUser(dto: RegisterDto, hashedPassword: string) {
    return this.prismaService.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
      },
    });
  }

  async findUserByToken(token: string) {
    return this.prismaService.token.findFirst({
      where: {
        token,
      },
      select: {
        userId: true,
      },
    });
  }

  async getAllUsers() {
    return this.prismaService.user.findMany();
  }
}
