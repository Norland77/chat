import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteDto } from './dto/invite.dto';
import { UserService } from '../user/user.service';
import { RoomService } from '../room/room.service';
import {IInvite} from "./interfaces/IInvite";
import {IRoom} from "../room/interfaces/IRoom";
import {IUser} from "../user/interfaces/IUser";
const REFRESH_TOKEN = 'refreshtoken';
@Controller('invite')
export class InviteController {
  constructor(
    private readonly inviteService: InviteService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  @Post('create')
  async createInvite(@Body() dto: InviteDto): Promise<IInvite> {
    const invite: IInvite = await this.inviteService.findInviteByRoom(dto.roomId);

    if (invite) {
      throw new BadRequestException(`invite for this room is already exist`);
    }

    const inviteCreated: IInvite = await this.inviteService.createInvite(dto);

    if (!inviteCreated) {
      throw new BadRequestException();
    }

    const inviteLink: IRoom = await this.roomService.addInviteLink(
      dto.inviteLink,
      dto.roomId,
    );
    if (!inviteLink) {
      throw new BadRequestException();
    }

    return inviteCreated;
  }

  @Put('accept/:RoomId')
  async acceptInvite(
    @Param('RoomId') roomId: string,
    @Body() userId: { userId: string },
  ): Promise<IRoom> {
    const user: IUser = await this.userService.findUserById(userId.userId);

    if (!user) {
      throw new BadRequestException(
        `please auth to chat for accept this invite`,
      );
    }

    const room: IRoom = await this.roomService.findRoomById(roomId);

    if (!room) {
      throw new BadRequestException(`room with id: ${roomId} is not exist`);
    }

    return this.roomService.addUserToRoom(roomId, user.id);
  }

  @Get('token/:Token')
  async getRoomByToken(@Param('Token') token: string): Promise<IInvite> {
    const room: IInvite = await this.inviteService.findRoomByToken(token);

    if (!room) {
      throw new BadRequestException(`room with token: ${token} is not exist`);
    }

    return room;
  }
}
