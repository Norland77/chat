export class RoomCreateDto {
  name: string;
  ownerId: string;
  isPrivate: boolean;
  firstUserId?: string;
  secondUserId?: string;
}
