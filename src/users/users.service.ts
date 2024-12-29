/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';

@Injectable()
export class UsersService {

  //* Constructor
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ){}


  //? Servicio para crear un usuario
  async createUser(createUserDto: CreateUserDto) {
    //* Creamos una constante y extraemos los valores del DTO
    const { str_user_username, str_user_email, str_user_password } = createUserDto;
  
    const saltOrRounds = 10;
  
    //* Verificamos si el usuario ya existe
    const userExists = await this.userRepository.findOne({
      where: [{ str_user_username }, { str_user_email }],
    });
  
    //* Si el usuario ya existe, lanzamos un error
    if (userExists) {
      if (userExists.str_user_username === str_user_username) {
        throw new HttpException('El usuario ya existe', HttpStatus.BAD_REQUEST);
      }
  
      if (userExists.str_user_email === str_user_email) {
        throw new HttpException('El correo ya existe', HttpStatus.BAD_REQUEST);
      }
    }
  
    //* Encriptamos la contraseña
    const hashPassword = await bcrypt.hash(str_user_password, saltOrRounds);
  
    //* Registramos el usuario en la base de datos
    const newUser = await this.userRepository.create({
      str_user_username,
      str_user_password: hashPassword,
      str_user_email,
    });
  
    try {
      await this.userRepository.save(newUser);
  
      const payload: JwtPayload = { id: newUser.int_user_id.toString() };
      const token = this.geyJwtToken(payload);
  
      return {
        newUser,
        token,
      };
    } catch (error) {
      throw new HttpException('Error al crear usuario', HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    const users = this.userRepository.find();
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }



  //?--------------------------------------------------------------------------------
  //? Servicio para generar un token con jwt
  //?--------------------------------------------------------------------------------

  geyJwtToken( payload: JwtPayload ){
    const token = this.jwtService.sign( payload );
    return token;
  }

}
