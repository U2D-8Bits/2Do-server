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


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
