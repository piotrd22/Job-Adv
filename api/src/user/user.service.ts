import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<Omit<User[], 'password'>> {
    try {
      const users = await this.prisma.user.findMany();
      return this.prisma.exclude(users, ['password']);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteProfile(userId: number): Promise<string> {
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });

      return 'User has been deleted successfully';
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId: number, dto: EditUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...dto,
        },
      });

      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email is already taken!');
        }
      }
      throw error;
    }
  }
}
