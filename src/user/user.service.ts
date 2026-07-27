import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        password: hashedPassword,
        email: createUserDto.email,
        name: createUserDto.name,
        role: createUserDto.role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, data: Partial<CreateUserDto>) {
    await this.findById(id);
    return this.prisma.user.update({
      where: {
        id,
      },
      data: data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async delete(id: number) {
    // 先查用户，同时检查是否有关联帖子
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { posts: { select: { id: true } } }, // 只查 id 即可
    });

    if (!user) {
      throw new NotFoundException(`用户 ${id} 不存在`);
    }

    if (user.posts.length > 0) {
      throw new BadRequestException(
        '该用户还有帖子，请先删除所有帖子再删除用户',
      );
    }
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
