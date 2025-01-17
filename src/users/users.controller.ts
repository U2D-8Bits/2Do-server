/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */


import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { LoginService } from './login.service';
import { UsersService } from './users.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, Multer } from 'multer';
import { extname } from 'path';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly loginService: LoginService
  ) {}

  //?--------------------------------------------------------------------------------
  //? Servicio para registrar un usuario
  //?--------------------------------------------------------------------------------
  @Post()
  async create(@Body() registerUserDto: CreateUserDto) {
    return await this.usersService.registerUser(registerUserDto);
  }


  //?--------------------------------------------------------------------------------
  //? Servicio para obtener todos los usuarios paginados
  //?--------------------------------------------------------------------------------
  @Get()
  async findAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number
  ){
    const users = await this.usersService.getAllPaginatedUsers(Number(page) || 1, Number(limit) || 10);
    return users;
  }

  //?--------------------------------------------------------------------------------
  //? Servicio para obtener un usuario por ID
  //?--------------------------------------------------------------------------------
  @Get(':id')
  async findOneById(
    @Param('id') id: number
  ){
    const user = await this.usersService.getUserById(id);
    return user;
  }

  
  //?--------------------------------------------------------------------------------
  //? Servicio para actualizar un usuario
  //?--------------------------------------------------------------------------------
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ){
    const user = await this.usersService.updateUser(updateUserDto, Number(id));
    return user;
  }

  //?--------------------------------------------------------------------------------
  //? Servicio para Actualizar la foto de perfil de un usuario
  //?--------------------------------------------------------------------------------
  @Post(':id/upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: '../../uploads/profile_pictures',
        filename: (req, file, cb ) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        }
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if( !allowedTypes.includes(file.mimetype)){
          cb(new HttpException('Tipo de archivo no permitido', HttpStatus.BAD_REQUEST), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async uploadProfilePicture(
    @Param('id') id: number,
    @UploadedFile() file: Multer.File
  ){
    if(!file){
      throw new HttpException('Archivo no encontrado', HttpStatus.BAD_REQUEST);
    }

    const filePath = file.filename;
    return await this.usersService.updateProfilePicture(id, filePath);
  }

  //?--------------------------------------------------------------------------------
  //? Servicio para eliminar un usuario
  //?--------------------------------------------------------------------------------
  @Delete(':id')
  async removeUser(
    @Param('id') id: number
  ){
    const user = await this.usersService.deleteUser(id);
    return user;
  }
}
