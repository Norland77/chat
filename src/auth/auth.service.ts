import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: RegisterDto) {
    return await this.authRepository.register(dto);
  }

  async login(dto: LoginDto) {
    return this.authRepository.login(dto);
  }

  async refreshtoken(refreshtoken: string) {
    return this.authRepository.refreshtoken(refreshtoken);
  }

  async logout(refreshtoken: string) {
    return this.authRepository.logout(refreshtoken);
  }
}
