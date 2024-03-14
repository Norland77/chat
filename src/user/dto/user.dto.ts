import { IsNotEmpty, MinLength, IsString } from 'class-validator';
export class UserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @MinLength(8)
  password?: string;
}
