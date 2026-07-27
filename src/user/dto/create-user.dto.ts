import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client'; // 直接从 Prisma 导入枚举

export class CreateUserDto {
  @ApiProperty({ example: '张三' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'zhangsan@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'USER', enum: Role })
  @IsEnum(Role)
  @IsOptional()
  role?: Role; // 使用 Prisma 中的 Role 枚举类型
}
