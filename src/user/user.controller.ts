import { Body, Controller, Delete, Get, Param, Put } from "@nestjs/common";
import { UserService } from './user.service';
import {IUser} from "./interfaces/IUser";
import {IUserController} from "./interfaces/user.controller.interface";
import { UserEditDto } from "./dto/user-edit.dto";

@Controller('user')
export class UserController implements IUserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAllUsers(): Promise<IUser[]> {
    return this.userService.getAllUsers();
  }

  @Get(':Id')
  async findUserById(@Param('Id') Id: string): Promise<IUser> {
    return this.userService.findUserById(Id);
  }

  @Delete(':Id')
  async deleteUserById(@Param('Id') Id: string): Promise<IUser> {
    return this.userService.deleteUserById(Id);
  }

  @Put(':Id')
  async editUserById(@Param('Id') id: string, @Body() dto: UserEditDto) {
    await this.userService.findUserById(id);

    return this.userService.editUserById(id, dto);
  }
}
