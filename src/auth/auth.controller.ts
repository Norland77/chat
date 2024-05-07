import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto, RegisterDto} from './dto';
import {ITokens} from './interfaces';
import {ConfigService} from '@nestjs/config';
import {Response} from 'express';
import {Cookie, Public} from '../../libs/common/src/decorators';
import {IUser} from "../user/interfaces/IUser";
import {UserService} from "../user/user.service";
import {compareSync} from "bcrypt";
import {IToken} from "./interfaces/IToken";
import {IAuthController} from "./interfaces/auth.controller.interface";

const REFRESH_TOKEN = 'refreshtoken111'
@Public()
@Controller('auth')
export class AuthController implements IAuthController{
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<IUser> {
    const userName = await this.userService.getUserByName(dto.username, dto.email);

    if (userName) {
      throw new BadRequestException('This username or email is already in use');
    }

    return await this.userService.createUser(dto)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response): Promise<ITokens> {
    const user = await this.userService.getUserByEmail(dto.email)

    if (!user || !compareSync(dto.password, user.password)) {
      throw new UnauthorizedException('Wrong login or password');
    }

    const token: ITokens = await this.authService.login(user);

    await this.authService.setRefreshTokenToCookies(token, res);

    return token;
  }

  @Get('logout')
  async logout(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }
    await this.authService.logout(refreshToken);
    res.cookie(this.configService.get('REFRESH_TOKEN'), '', {
      httpOnly: true,
      secure: true,
      expires: new Date(),
    });
    res.sendStatus(HttpStatus.OK);
  }

  @Get('refresh-tokens')
  async refreshToken(
    @Cookie(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response,
  ): Promise<IToken> {

    const token: IToken = await this.authService.refreshToken(refreshToken);

    const user = await this.userService.findUserById(token.userId);

    const tokenToCookies = await this.authService.refresh(user, token)

    await this.authService.setRefreshTokenToCookies(tokenToCookies, res);

    return token;
  }
}
