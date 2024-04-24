import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {MessageService} from '../message/message.service';
import {Logger} from '@nestjs/common';
import {Namespace, Server, Socket} from 'socket.io';
import {S3} from 'aws-sdk';
import {ConfigService} from '@nestjs/config';
import {IMessage} from "../message/interfaces/IMessage";
import {IFile} from "../message/interfaces/IFile";
import {MessageDeleteDto} from "../message/dto/message-delete.dto";
import {DefaultEventsMap} from "socket.io/dist/typed-events";
import { IAvatarEdit } from "./interfaces/IAvatarEdit";
import { UserService } from "../user/user.service";
import {v4} from 'uuid'

let fullChunk: Buffer = Buffer.alloc(0);

@WebSocketGateway({ cors: { origin: '*' } })
export class SocketService implements OnGatewayInit {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit(server: any): any {
    console.log('init: ' + server);
  }

  handleConnection(client: Socket) {
    console.log('Connected');
  }

  async uploadPublicFile(dataBuffer: Buffer, filename: string, userId: string, filetype): Promise<S3.ManagedUpload.SendData> {
    const s3 = new S3();

    return s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${userId}/${filetype}/${filename}${v4()}`,
      })
      .promise();
  }
  @SubscribeMessage('chatToServer')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: IMessage,
  ) {
    let results: IFile[] = [];
    if (message.files.length > 0) {
      for (const fileInfo of message.files) {
        const uploadResult: S3.ManagedUpload.SendData = await this.uploadPublicFile(
          fullChunk,
          fileInfo.name,
          message.userId,
          fileInfo.mimetype
        );
        results.push({ path: uploadResult.Location, name: fileInfo.name, mimetype: fileInfo.mimetype });
      }
    }

    const createdMessage: IMessage = await this.messageService.createMessage({
      text: message.text,
      username: message.username,
      roomId: message.roomId,
      userId: message.userId,
      files: results,
    });

    console.log(createdMessage);
    fullChunk = Buffer.alloc(0);
    this.wss.to(message.roomId).emit('chatToClient', createdMessage);
  }

  @SubscribeMessage('chatToServerSetAvatar')
  async handleSetAvatar(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: IAvatarEdit,
  ) {
    if (data.file) {
      const uploadResult: S3.ManagedUpload.SendData = await this.uploadPublicFile(
        fullChunk,
        data.file.name,
        data.userId,
        data.file.mimetype
      );

      const user = await this.userService.findUserById(data.userId);

      if (user.avatar_url !== null) {
        const s3: S3 = new S3();

        const avatar = await this.messageService.findFileByPath(user.avatar_url);
        await s3
          .deleteObject({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: `${data.userId}/${avatar.mimetype}/${avatar.name}`,
          })
          .promise();

        await this.messageService.deleteFileById(avatar.id);
      }
      await this.messageService.uploadAvatar({mimetype: data.file.mimetype, path: uploadResult.Location, name: data.file.name})
      await this.userService.setAvatarById(data.userId, uploadResult.Location);
    }
    fullChunk = Buffer.alloc(0);
  }

  @SubscribeMessage('chatToServerDelete')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: MessageDeleteDto,
  ) {
    const s3: S3 = new S3();
    const deleteMessage: IMessage = await this.messageService.deleteMessage(dto.id);
    if (deleteMessage) {
      deleteMessage.files.map(async (file: IFile): Promise<void> => {
        await s3
          .deleteObject({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: `${deleteMessage.userId}/${file.mimetype}/${file.name}`,
          })
          .promise();
      });
    }
    this.wss.to(dto.roomId).emit('chatToClientDelete', dto.id);
  }

  @SubscribeMessage('chatToServerUpdate')
  async handleUpdateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    message: {
      id: string;
      message: { text: string; roomId: string };
    },
  ): Promise<void> {
    await this.messageService.editMessage(message);
    this.wss.to(message.message.roomId).emit('chatToClientUpdate', message);
  }

  @SubscribeMessage('getUsersInRoom')
  handleUsersInRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: { roomId: string },
  ): void {
    const namespace: Namespace<DefaultEventsMap, any> = this.wss.of('/');
    const rooms: Map<string, Set<string>> = namespace.adapter.rooms;
    const room: Set<string> = rooms.get(roomId.roomId);
    if (room) {
      const userCount: number = room.size;
      this.wss.to(roomId.roomId).emit('UsersInRoom', userCount);
    } else {
      this.wss.to(roomId.roomId).emit('UsersInRoom', 0);
    }
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeft(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('kickUser')
  handleRoomKick(client: Socket, @MessageBody() roomId: { roomId: string }): void {
    this.wss.to(roomId.roomId).emit('kickedUser');
  }

  @SubscribeMessage('userAddToChat')
  handleRoomAddUserToChat(
    client: Socket,
    @MessageBody() roomId: { roomId: string },
  ): void {
    this.wss.to(roomId.roomId).emit('userAdd');
  }

  @SubscribeMessage('uploadChunk')
  async handleUploadChunk(@MessageBody() data: any): Promise<void> {
    fullChunk = Buffer.concat([fullChunk, data]);
    console.log(fullChunk);
  }
}
