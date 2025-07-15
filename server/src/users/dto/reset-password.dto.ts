import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ example: 'alice@example.com' })
  email!: string;

  @ApiProperty({ example: 'newpass' })
  password!: string;
}
