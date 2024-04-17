import {Body, Controller, Get, Param, Post, Put,} from '@nestjs/common';
import {InviteService} from './invite.service';
import {InviteDto} from './dto/invite.dto';
import {UserService} from '../user/user.service';
import {RoomService} from '../room/room.service';
import {IInvite} from "./interfaces/IInvite";
import {IRoom} from "../room/interfaces/IRoom";
import {IUser} from "../user/interfaces/IUser";
import {IInviteController} from "./interfaces/invete.controller.interface";

@Controller('invite')
export class InviteController implements IInviteController{
  constructor(
    private readonly inviteService: InviteService,
    private readonly userService: UserService,
    private readonly roomService: RoomService,
  ) {}

  @Post('create')
  async createInvite(@Body() dto: InviteDto): Promise<IInvite> {
    await this.inviteService.findInviteByRoom(dto.roomId);

    const inviteCreated: IInvite = await this.inviteService.createInvite(dto);

    await this.roomService.addInviteLink(
      dto.inviteLink,
      dto.roomId,
    );

    return inviteCreated;
  }

  @Put('accept/:RoomId')
  async acceptInvite(
    @Param('RoomId') roomId: string,
    @Body() userId: { userId: string },
  ): Promise<IRoom> {
    const user: IUser = await this.userService.findUserById(userId.userId);

    await this.roomService.findRoomById(roomId);

    return this.roomService.addUserToRoom(roomId, user.id);
  }

  @Get('token/:Token')
  async getRoomByToken(@Param('Token') token: string): Promise<IInvite> {
    return await this.inviteService.findRoomByToken(token);
  }
}
