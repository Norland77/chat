import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageDto } from './dto/createMessage.dto';
import {IFile} from "./interfaces/IFile";

@Controller('message')
export class MessageRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async createMessage(dto: MessageDto, filesInput: IFile[]) {
    return this.prismaService.messages.create({
      data: {
        text: dto.text,
        userId: dto.userId,
        roomId: dto.roomId,
        username: dto.username,
        files: {
          create: filesInput ? filesInput : [],
        },
      },
      include: {
        files: true,
      },
    });
  }

  async getAllMessages(id: string) {
    return this.prismaService.messages.findMany({
      where: {
        roomId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        files: true,
      },
    });
  }

  async findMessageById(id: string) {
    return this.prismaService.messages.findFirst({
      where: {
        id,
      },
    });
  }

  async deleteMessage(id: string) {
    return this.prismaService.messages.delete({
      where: {
        id,
      },
      include: {
        files: true,
      },
    });
  }

  async editMessage(dto: { id: string; message: { text: string; roomId: string } }) {
    return this.prismaService.messages.update({
      where: {
        id: dto.id,
      },
      data: {
        text: dto.message.text,
      },
    });
  }
}
