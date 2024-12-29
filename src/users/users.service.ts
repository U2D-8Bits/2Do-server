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

  //?--------------------------------------------------------------------------------
  //? Servicio para registrar un usuario
  //?--------------------------------------------------------------------------------
  async registerUser(registerUserDto: CreateUserDto) {
    
    //* Desestructuramos el objeto registerUserDto
    const { str_user_email, str_user_password, str_user_username } = registerUserDto;

    //* Cremos un hash de la contraseña
    const saltOrRounds = 10;

    //* Verificamos si el usuario ya existe en la base de datos
    const userExists = await this.userRepository.findOne({
      where: [
        { str_user_email },
        { str_user_username }
      ]
    })

    //* Si el usuario ya existe lanzamos un error
    if( userExists ){
      
      if( userExists.str_user_username === str_user_username ){
        throw new HttpException('El nombre de usuario ya está en uso', HttpStatus.BAD_REQUEST);
      }
      
      if( userExists.str_user_email === str_user_email ){
        throw new HttpException('El correo electrónico ya está en uso', HttpStatus.BAD_REQUEST);
      }

    }

    //* Encriptamos la contraseña
    const hashedPassword = await bcrypt.hash(str_user_password, saltOrRounds);


    //* Registramos el usuario en la base de datos
    const registeredUser = await this.userRepository.create({
      str_user_email,
      str_user_username,
      str_user_password: hashedPassword
    })

    try {
      await this.userRepository.save(registeredUser);
      return registeredUser

    } catch (error) {
      throw new HttpException('Error al registrar el usuario', HttpStatus.BAD_REQUEST);
    }

  }


  //?--------------------------------------------------------------------------------
  //? Servicio para loguear un usuario
  //?--------------------------------------------------------------------------------


  //?--------------------------------------------------------------------------------
  //? Servicio para obtener todos los usuarios registrados con paginación
  //?--------------------------------------------------------------------------------

  async getAllPaginatedUsers( page: number = 1, limit: number = 10 ): Promise<{ users: User[], total: number}>{

    if( page < 1 || limit <1 ){
      throw new HttpException('La página y el límite deben ser mayores a 0', HttpStatus.BAD_REQUEST);
    }

    const [ users, total ] = await this.userRepository.findAndCount({
      skip: ( page - 1 ) * limit,
      take: limit,
    });


    return{
      users,
      total
    }
  }


  //?--------------------------------------------------------------------------------
  //? Servicio para obtener un usuario por ID
  //?--------------------------------------------------------------------------------

  async getUserById(id: number): Promise<User>{

    //* Buscamos el usuario en la base de datos
    const user = await this.userRepository.findOne({
      where: { int_user_id: id}
    });

    //* Si el usuario no existe lanzamos un error
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    
    try {
      //* Retornamos el usuario 
      return user;

    } catch (error) {
      //* Si hay un error lanzamos un error
      throw new HttpException('Error al obtener el usuario', HttpStatus.BAD_REQUEST);

    }
  }


  //?--------------------------------------------------------------------------------
  //? Servicio para actualizar un usuario
  //?--------------------------------------------------------------------------------


  //?--------------------------------------------------------------------------------
  //? Servicio para eliminar un usuario
  //?--------------------------------------------------------------------------------

  async deleteUser(id: number): Promise<User>{

    //* Buscamos el usuario en la base de datos
    const user = await this.userRepository.findOne({
      where: { int_user_id: id}
    })


    //* Si el usuario no existe lanzamos un error
    if( !user ){
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    try {
      //* Eliminamos el usuario
      await this.userRepository.remove(user);
      return user;

    } catch (error) {
      //* Si hay un error lanzamos un error
      throw new HttpException('Error al eliminar el usuario', HttpStatus.BAD_REQUEST);
    }

  }


  //?--------------------------------------------------------------------------------
  //? Servicio para generar un token con jwt
  //?--------------------------------------------------------------------------------
  geyJwtToken( payload: JwtPayload ){
    const token = this.jwtService.sign( payload );
    return token;
  }

}
