/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LoginService {
  //* Constructor
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //?--------------------------------------------------------------------------------
  //? Servicio para generar un token con jwt
  //?--------------------------------------------------------------------------------
  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  //?--------------------------------------------------------------------------------
  //? Servicio para loguear un usuario
  //?--------------------------------------------------------------------------------

  async login(loginDto: LoginDto) {
    //* Desestructuramos el objeto loginDto
    const { str_user_email, str_user_password } = loginDto;

    //* Buscamos al usuario en la base de datos
    const user = await this.userRepository.findOne({
      where: { str_user_email },
    });

    //* Si el usuario no existe, lanzamos un error
    if (!user) {
      if (user.str_user_email !== str_user_email) {
        throw new HttpException(
          'Correo electrónico incorrecto',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.str_user_password !== str_user_password) {
        throw new HttpException(
          'Contraseña incorrecta',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    //* Generamos el token
    const token = this.getJwtToken({ id: user.int_user_id.toString() });

    //* Retornamos el usado y el token
    return {
      user,
      token,
    };
  }

  //?--------------------------------------------------------------------------------
  //? Servicio para verificar el token
  //?--------------------------------------------------------------------------------

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
  }
}
