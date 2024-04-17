import { Controller } from '@nestjs/common';
import { Token } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { v4 } from 'uuid';
import { add } from 'date-fns';
import {IToken} from "./interfaces/IToken";
import {IAuthRepository} from "./interfaces/auth.repository.interface";

@Controller('user')
export class AuthRepository implements IAuthRepository{
  constructor( private readonly prismaService: PrismaService ) {}

  async logout(refreshToken: string): Promise<IToken> {
    return this.prismaService.token.delete({
      where: { token: refreshToken },
    });
  }

  async findToken(refreshToken: string): Promise<IToken | null> {
    return this.prismaService.token.findUnique({
      where: { token: refreshToken },
    });
  }

  async deleteToken(refreshToken: string): Promise<IToken> {
    return this.prismaService.token.delete({
      where: { token: refreshToken },
    });
  }

  async getRefreshToken(userId: string): Promise<Token> {
    const _token = await this.prismaService.token.findFirst({
      where: {
        userId,
      },
    });
    const token = _token?.token ?? '';
    return this.prismaService.token.upsert({
      where: { token },
      update: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
      },
      create: {
        token: v4(),
        exp: add(new Date(), { months: 1 }),
        userId,
      },
    });
  }
}
