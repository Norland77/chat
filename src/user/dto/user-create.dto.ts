import { IsNotEmpty, MinLength, IsString } from 'class-validator';
export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8)
  password?: string;
}
