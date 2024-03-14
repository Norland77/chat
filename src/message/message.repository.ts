import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageDto } from './dto/message.dto';

@Controller('message')
export class MessageRepository {
  constructor(private readonly prismaService: PrismaService) {}
  createMessage(dto: MessageDto) {
    let filesInput = [];
    console.log(dto);
    if (dto.files.length > 0) {
      filesInput = dto.files.map((file) => ({
        name: file.name,
        path: file.path,
        mimetype: file.mimetype,
      }));
    }
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

  getAllMessages(id: string) {
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

  findMessageById(id: string) {
    return this.prismaService.messages.findFirst({
      where: {
        id,
      },
    });
  }

  deleteMessage(id: string) {
    return this.prismaService.messages.delete({
      where: {
        id,
      },
      include: {
        files: true,
      },
    });
  }

  editMessage(dto: { id: string; message: { text: string; roomId: string } }) {
    //console.log(id)
    console.log(dto.id);

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
