import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiTags('文章')
@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '添加文章' })
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取所有文章' })
  async findAll() {
    return this.postService.findAll();
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取自己的所有文章' })
  async findMy(@CurrentUser() user) {
    return this.postService.findByAuthorId(+user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '通过文章id获取文章' })
  async findById(@Param('id') id: string) {
    return this.postService.findById(+id);
  }

  @Get('author/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '通过用户id获取文章' })
  async findByauthId(@Param('id') id: string) {
    return this.postService.findByAuthorId(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新文章' })
  @ApiBody({ type: CreatePostDto })
  async update(@Param('id') id: string, @Body() data: Partial<CreatePostDto>) {
    return this.postService.update(+id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章' })
  async delete(@Param('id') id: string) {
    return this.postService.delete(+id);
  }
}
