/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */


import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //?--------------------------------------------------------------------------------
  //? Servicio para registrar un usuario
  //?--------------------------------------------------------------------------------
  @Post()
  async create(@Body() registerUserDto: CreateUserDto) {
    return await this.usersService.registerUser(registerUserDto);
  }

  //?--------------------------------------------------------------------------------
  //? Servicio para iniciar sesión
  //?--------------------------------------------------------------------------------


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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }


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
