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
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtGuard)
  @Get('profile')
  getProfile(@GetUser() user: User) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Delete('profile')
  deleteProfile(@GetUser('id') userId: number) {
    return this.userService.deleteProfile(userId);
  }

  @UseGuards(JwtGuard)
  @Patch('profile')
  updateProfile(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return this.userService.updateProfile(userId, dto);
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }
}
