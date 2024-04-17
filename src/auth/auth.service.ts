import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginDto, RegisterDto } from './dto';
import {IUser} from "../user/interfaces/IUser";
import {IToken} from "./interfaces";
import {ITokenLogout} from "./interfaces/ITokenLogout";

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: RegisterDto): Promise<IUser> {
    return this.authRepository.register(dto);
  }

  async login(dto: LoginDto): Promise<IToken> {
    return this.authRepository.login(dto);
  }

  async refreshtoken(refreshToken: string): Promise<IToken> {
    return this.authRepository.refreshtoken(refreshToken);
  }

  async logout(refreshtoken: string): Promise<ITokenLogout> {
    return this.authRepository.logout(refreshtoken);
  }
}
