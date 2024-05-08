import {BadRequestException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import {IUser} from "../user/interfaces/IUser";
import {ITokens} from "./interfaces";
import {IToken} from "./interfaces/IToken";
import {Response} from "express";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {IAuthService} from "./interfaces/auth.service.interface";

@Injectable()
export class AuthService implements IAuthService{
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async refreshToken(refreshToken: string): Promise<IToken> {
    const string = '';
    if (typeof refreshToken !== typeof string) {
      throw new UnauthorizedException();
    }
    const token = await this.authRepository.findToken(refreshToken);
    if (!token) {
      throw new UnauthorizedException();
    }

    if (new Date(token.exp) < new Date()) {
      await this.authRepository.deleteToken(refreshToken);
      throw new UnauthorizedException();
    }

    return token
  }

  async logout(refreshToken: string): Promise<IToken> {
    return this.authRepository.logout(refreshToken);
  }

  async setRefreshTokenToCookies(tokens: ITokens, res: Response): Promise<void> {
    if (!tokens) {
      throw new UnauthorizedException();
    }
    res.cookie(this.configService.get('REFRESH_TOKEN'), tokens.refreshToken.token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: new Date(tokens.refreshToken.exp),
      secure:
        this.configService.get('NODE_ENV', 'development') === 'production',
      path: '/',
    });
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }

  async login(user: IUser): Promise<ITokens> {
    const accessToken = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });

    const refreshToken = await this.authRepository.getRefreshToken(user.id);

    if (!refreshToken || !accessToken) {
      throw new BadRequestException(
        `Can't login user`,
      );
    }

    return { accessToken, refreshToken };
  }

  async refresh(user: IUser, refreshToken: IToken): Promise<ITokens> {
    const accessToken = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });

    return { accessToken, refreshToken };
  }

  async createConfirmCode(email: string, code: string) {
    return this.authRepository.createConfirmCode(email, code);
  }

  async findCodeByEmail(email: string) {
    return this.authRepository.findCodeByEmail(email);
  }

  async updateCodeById(id: string, code: string) {
    return this.authRepository.updateCodeById(id, code);
  }
}
