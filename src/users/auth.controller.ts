/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly loginService: LoginService) {}

  //?--------------------------------------------------------------------------------
  //? Servicio para iniciar sesión
  //?--------------------------------------------------------------------------------
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.loginService.login(loginDto);
  }

  //?--------------------------------------------------------------------------------
  //? Servicio para verificar el token
  //?--------------------------------------------------------------------------------
  @Get('verify')
  verifyToken(@Request() req: Request): any {
    const user = req['user'] as User;

    return {
      user,
      token: this.loginService.getJwtToken({ id: user.int_user_id.toString() }),
    };
  }
}
