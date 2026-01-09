import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ActivateAccountDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  token: string;
}