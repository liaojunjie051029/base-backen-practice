import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Post title' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Post content' })
  @IsString()
  content?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  authorId!: number;
}
