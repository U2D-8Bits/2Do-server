/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

import { join } from 'path';
import * as fs from 'fs';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  //* Constructor
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ){}

  //?--------------------------------------------------------------------------------
  //? Servicio para registrar un usuario
  //?--------------------------------------------------------------------------------
  async registerUser(registerUserDto: CreateUserDto) {
    
    //* Desestructuramos el objeto registerUserDto
    const { str_user_email, str_user_password, str_user_password_confirm, str_user_username } = registerUserDto;

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

    //* Verificamos que las contraseñas sean iguales
    if( str_user_password !== str_user_password_confirm ){
      throw new HttpException('Las contraseñas no coinciden', HttpStatus.BAD_REQUEST);
    }

    //* Encriptamos las contraseñas
    const hashedPassword = await bcrypt.hash(str_user_password, saltOrRounds);

    //* Registramos el usuario en la base de datos
    const registeredUser = await this.userRepository.create({
      str_user_email,
      str_user_username,
      str_user_password: hashedPassword,
      str_user_password_confirm: hashedPassword,
      str_user_profile_picture: 'default-profile.png'
    })

    try {
      await this.userRepository.save(registeredUser);
      return registeredUser

    } catch (error) {
      throw new HttpException('Error al registrar el usuario', HttpStatus.BAD_REQUEST);
    }

  }

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

    //* Verificamos si el usuario tiene una imagen distinta a la por defecto
    if( user.str_user_profile_picture == 'default-profile.png' ){
      //* Creamos la ruta de la imagen por defecto
      const basePath = `${process.env.BASE_URL}/uploads/default-profile.png`;
      user.str_user_profile_picture = basePath;
    }else{
      //* Creamos la ruta de la imagen
      const basePath = `${process.env.BASE_URL}/uploads/profile_pictures` || 'http://localhost:3000/uploads/profile_pictures';
      user.str_user_profile_picture = `${basePath}/${user.str_user_profile_picture}`;
    }

    console.log(user.str_user_profile_picture);

    
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

  async updateUser( updateUserDto: UpdateUserDto, id: number ): Promise<User>{

    //* Buscamos el usuario en la base de datos
    const user = await this.userRepository.findOne({
      where: { int_user_id: id}
    })

    //* Si el usuario no existe lanzamos un error
    if( !user ){
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    //* desestructuramos el usuario a actualizar
    const { str_user_email, str_user_username, str_user_password } = updateUserDto;

    //* Actualizamos los datos del usuario
    const updatedUser = {
      ...user,
      str_user_email: str_user_email || user.str_user_email,
      str_user_username: str_user_username || user.str_user_username,
      str_user_password: str_user_password ? await bcrypt.hash(str_user_password, 10) : user.str_user_password
    }

    try {
      await this.userRepository.save(updatedUser);
      return updatedUser;

    } catch (error) {
      //* Si hay un error lanzamos un error
      throw new HttpException('Error al actualizar el usuario', HttpStatus.BAD_REQUEST);
    }

  }


  //?--------------------------------------------------------------------------------
  //? Servicio para Actualizar foto de perfil
  //?--------------------------------------------------------------------------------

  async updateProfilePicture(userId: number, filePath: string ): Promise<User>{

    //* Buscamos el usuario en la base de datos
    const user = await this.userRepository.findOne({
      where: { int_user_id: userId}
    })

    //* Si el usuario no existe lanzamos un error
    if( !user ){
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    //* Creamos la ruta de la imagen
    const basePath = process.env.PROFILE_PICTURE_PATH || '/uploads/profile_pictures';

    //* Si el usuario ya tiene una foto de perfil la eliminamos
    if( user.str_user_profile_picture != 'default-profile.png' ){
      const oldImagePath = join(basePath, user.str_user_profile_picture);
      if( fs.existsSync(oldImagePath) ){
        fs.unlinkSync(oldImagePath);
      }
    }

    //* Actualizamos la foto de perfil del usuario
    user.str_user_profile_picture = filePath;

    await this.userRepository.save(user);

    return user;
  }


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

}
