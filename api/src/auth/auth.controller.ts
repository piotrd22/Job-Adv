import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import { AuthDto } from './dto';
import { JwtGuard } from './guard';
import { RjwtGuard } from './guard/rjwt.guard';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetUser('id') id: number): Promise<boolean> {
    return this.authService.logout(id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(RjwtGuard)
  @Post('refresh')
  refreshTokens(
    @GetUser('sub') id: number,
    @GetUser('refreshToken') rt: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(id, rt);
  }
}
