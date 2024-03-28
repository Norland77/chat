import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessageService } from '../message/message.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';

let fullChunk: Buffer = Buffer.alloc(0);
let info;
let isFile = false;
@WebSocketGateway({ cors: { origin: '*' } })
export class SocketService implements OnGatewayInit {
  constructor(
    private readonly messageService: MessageService,
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

  async uploadPublicFile(dataBuffer: Buffer, filename: string, userId: string) {
    const s3 = new S3();

    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${userId}/${filename}`,
      })
      .promise();

    return uploadResult;
  }

  @SubscribeMessage('chatToServer')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    message: {
      text: string;
      roomId: string;
      userId: string;
      username: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    let results;
    if (isFile) {
      results = await this.uploadPublicFile(
        fullChunk,
        info.name,
        message.userId,
      );
    }

    const createdMessage = await this.messageService.createMessage({
      text: message.text,
      username: message.username,
      roomId: message.roomId,
      userId: message.userId,
      files: isFile
        ? [{ path: results.Location, name: info.name, mimetype: info.type }]
        : [],
    });

    console.log(createdMessage);
    fullChunk = Buffer.alloc(0);
    this.wss.to(message.roomId).emit('chatToClient', createdMessage);
  }

  @SubscribeMessage('chatToServerDelete')
  async handleDeleteMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() { id, roomId }: { id: string; roomId: string },
  ) {
    const s3 = new S3();
    const deleteMessage = await this.messageService.deleteMessage(id);
    if (deleteMessage) {
      deleteMessage.files.map(async (file) => {
        await s3
          .deleteObject({
            Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
            Key: `${deleteMessage.userId}/${file.name}`,
          })
          .promise();
      });
    }
    this.wss.to(roomId).emit('chatToClientDelete', id);
  }

  @SubscribeMessage('chatToServerUpdate')
  async handleUpdateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    message: {
      id: string;
      message: { text: string; roomId: string };
    },
  ) {
    await this.messageService.editMessage(message);
    this.wss.to(message.message.roomId).emit('chatToClientUpdate', message);
  }

  @SubscribeMessage('getUsersInRoom')
  handleUsersInRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: { roomId: string },
  ) {
    const namespace = this.wss.of('/');
    const rooms = namespace.adapter.rooms;
    const room = rooms.get(roomId.roomId);
    if (room) {
      const userCount = room.size;
      this.wss.to(roomId.roomId).emit('UsersInRoom', userCount);
    } else {
      this.wss.to(roomId.roomId).emit('UsersInRoom', 0);
    }
  }

  @SubscribeMessage('joinRoom')
  handleRoomJoin(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleRoomLeft(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('kickUser')
  handleRoomKick(client: Socket, @MessageBody() roomId: { roomId: string }) {
    console.log('Kick');
    this.wss.to(roomId.roomId).emit('kickedUser');
  }

  @SubscribeMessage('userAddToChat')
  handleRoomAddUserToChat(
    client: Socket,
    @MessageBody() roomId: { roomId: string },
  ) {
    console.log('Add');
    this.wss.to(roomId.roomId).emit('userAdd');
  }

  @SubscribeMessage('uploadChunk')
  async handleUploadChunk(@MessageBody() data: any): Promise<void> {
    console.log(data);
    fullChunk = Buffer.concat([fullChunk, data]);
    console.log(fullChunk);
  }

  @SubscribeMessage('sendFileInfo')
  handleUploadInfo(@MessageBody() data: any): void {
    console.log('info:', data);
    isFile = true;
    info = data;
  }
}
