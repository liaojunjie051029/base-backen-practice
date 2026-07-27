import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    await this.userService.findById(createPostDto.authorId);
    return this.prisma.post.create({
      data: {
        ...createPostDto,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        author: true,
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        author: true,
      },
      orderBy: {
        author: {
          id: 'asc',
        },
      },
    });
  }

  async findById(id: number) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        author: true,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  }

  async findByAuthorId(id: number) {
    return this.prisma.post.findMany({
      where: {
        authorId: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        author: true,
      },
    });
  }

  async update(id: number, data: Partial<CreatePostDto>) {
    const post = await this.prisma.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      throw new ConflictException('Post not found');
    }
    return this.prisma.post.update({
      where: {
        id,
      },
      data: data,
      select: {
        id: true,
        title: true,
        content: true,
        published: true,
        author: true,
      },
    });
  }

  async delete(id: number) {
    await this.findById(id);
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
