import { Controller, Delete, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import {IUser} from "./interfaces/IUser";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAllUsers(): Promise<IUser[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':Id')
  async findUserById(@Param('Id') Id: string): Promise<IUser> {
    return await this.userService.findUserById(Id);
  }

  @Delete(':Id')
  async deleteUserById(@Param('Id') Id: string): Promise<IUser> {
    return await this.userService.deleteUserById(Id);
  }
}
