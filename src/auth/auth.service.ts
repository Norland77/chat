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
    return await this.authRepository.register(dto);
  }

  async login(dto: LoginDto): Promise<IToken> {
    return await this.authRepository.login(dto);
  }

  async refreshtoken(refreshtoken: string): Promise<IToken> {
    return await this.authRepository.refreshtoken(refreshtoken);
  }

  async logout(refreshtoken: string): Promise<ITokenLogout> {
    return await this.authRepository.logout(refreshtoken);
  }
}
