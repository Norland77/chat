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
import { createTransport } from 'nodemailer';
import {IToken} from "./interfaces/IToken";
import {IAuthController} from "./interfaces/auth.controller.interface";
import { ConfirmCodeDto } from "./dto/confirm-code.dto";
/*const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "d67257c4",
  apiSecret: "LWYr4ZtCkZNx4g8U"
})*/

const REFRESH_TOKEN = 'refreshtoken111'
@Public()
@Controller('auth')
export class AuthController implements IAuthController{
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  //TODO: `Make two-factor via sms

 /* @UseInterceptors(ClassSerializerInterceptor)
  @Post('sms')
  async sms(@Body() number: any) {
    const from = "FlashChat"
    const to = number.number
    const text = `code: ${Math.floor(Math.random() * 1000000)}`

    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
  }*/

  transporter = createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'flashchaatt@gmail.com',
      pass: this.configService.get('GOOGLE_APP_KEY'),
    },
  });

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<IUser> {
    const userName = await this.userService.getUserByName(dto.username, dto.email);

    if (userName) {
      throw new BadRequestException('This username or email is already in use');
    }

    return await this.userService.createUser(dto)
  }

  @Post('send-email')
  async sendCodeToEmail(@Body() emailDto: {email: string}) {

    const code = Math.floor(100000 + Math.random() * 900000);

    const mail = await this.transporter.sendMail({
      from: '"Flash Chat" <flashchaatt@gmail.com>',
      to: emailDto.email,
      subject: 'Confirmation code',
      html: `
        <body style="background-color: #181818; text-align: center; color: #F0F0F0 !important; padding: 25px">
          <h1 style="font-size: 32px; font-weight: bold; color: #F0F0F0 !important">Confirmation code</h1>
          <p style="font-size: 20px; color: #F0F0F0 !important">
              You received this message because this email was specified for registration in flash chat. To continue registration, please enter the specified code on the code entry page.
          </p>
          <span style="height: 50px; font-size: 34px; border: solid 1px #303030; width: fit-content; padding: 5px 10px; border-radius: 15px; letter-spacing: 5px; color: #F0F0F0 !important">
              ${code}
          </span>
        </body>
      `,
    });

    if (!mail) {
      throw new BadRequestException('Email dont receive');
    }

    const existCode = await this.authService.findCodeByEmail(emailDto.email);

    if (existCode) {
      await this.authService.updateCodeById(existCode.id, String(code));
    } else {
      await this.authService.createConfirmCode(emailDto.email, String(code));
    }

    return true
  }

  @Post('confirm-code')
  async confirmCode(@Body() dto: ConfirmCodeDto) {
    const code = await this.authService.findCodeByEmail(dto.email);

    if (!code) {
      throw new BadRequestException(`code with email: ${dto.email} not found`)
    }

    if (code.code === dto.code) {
      return true
    } else {
      throw new BadRequestException(`incorrect code`)
    }
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
