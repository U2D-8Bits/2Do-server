/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */


import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

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
