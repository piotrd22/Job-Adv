import { Controller, Get, ParseIntPipe, UseGuards } from '@nestjs/common';
import { Delete, Param, Patch } from '@nestjs/common/decorators';
import { Body } from '@nestjs/common/decorators/http/route-params.decorator';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers(): Promise<Omit<User[], 'password'>> {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@GetUser() user: User): User {
    return user;
  }

  @UseGuards(JwtGuard)
  @Delete('profile')
  deleteProfile(@GetUser('id') userId: number): Promise<string> {
    return this.userService.deleteProfile(userId);
  }

  @UseGuards(JwtGuard)
  @Patch('profile')
  updateProfile(
    @GetUser('id') userId: number,
    @Body() dto: EditUserDto,
  ): Promise<User> {
    return this.userService.updateProfile(userId, dto);
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.getUserById(id);
  }
}
