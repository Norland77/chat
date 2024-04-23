import {BadRequestException, Injectable} from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { MessageDto } from './dto/message-create.dto';
import {IFile} from "./interfaces/IFile";
import {MessageEditDto} from "./dto/message-edit.dto";
import {IMessage} from "./interfaces/IMessage";
import {IMessageService} from "./interfaces/message.service.interface";

@Injectable()
export class MessageService implements IMessageService{
  constructor(private readonly messageRepository: MessageRepository) {}

  async createMessage(dto: MessageDto): Promise<IMessage> {
    let filesInput: IFile[] = [{
      name: '',
      mimetype: '',
      path: '',
    }];
    if (dto.files.length > 0) {
      filesInput = dto.files.map((file: IFile) => ({
        name: file.name,
        path: file.path,
        mimetype: file.mimetype,
      }));
    }

    return this.messageRepository.createMessage(dto, filesInput);
  }

  async getAllMessagesByRoom(id: string): Promise<IMessage[]> {
    return this.messageRepository.getAllMessages(id);
  }

  async findMessageById(id: string): Promise<void> {
    const message = await this.messageRepository.findMessageById(id);

    if (!message) {
      throw new BadRequestException(`message with id: ${id} is not exist`);
    }
  }

  async deleteMessage(id: string): Promise<IMessage> {
    return this.messageRepository.deleteMessage(id);
  }

  async editMessage(dto: MessageEditDto): Promise<IMessage> {
    return this.messageRepository.editMessage(dto);
  }

  getAllImagesByRoom(id: string): Promise<IFile[]> {
    return this.messageRepository.getAllImagesByRoom(id);
  }
}
