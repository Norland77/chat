import { Token } from '@prisma/client';

export interface IToken {
  accessToken: string;
  refreshtoken: Token;
}
