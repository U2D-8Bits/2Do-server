/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

//*------------------------------------------------------------------
//* Imports
//*------------------------------------------------------------------
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

//*------------------------------------------------------------------
//* Controller Class
//*------------------------------------------------------------------
@Controller('api/lists')
export class ListsController {

  //*------------------------------------------------------------------
  //* Constructor
  //*----------------------------------------------------------------
  constructor(private readonly listsService: ListsService) {}

  //*------------------------------------------------------------------
  //* Create List
  //*------------------------------------------------------------------
  @Post()
  async create(@Body() createListDto: CreateListDto) {
    return await this.listsService.create(createListDto);
  }

  //*------------------------------------------------------------------
  //* Find All Lists by User ID
  //*------------------------------------------------------------------
  @Get('user/:id')
  async findAll(
    @Param('id') id: number
  ) {
    console.log('response', this.listsService.findAll(id));
    return await this.listsService.findAll(id);
  }

  //*------------------------------------------------------------------
  //* Find One List by ID
  //*----------------------------------------------------------------
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.listsService.findOne(id);
  }

  //*------------------------------------------------------------------
  //* Update List by ID
  //*------------------------------------------------------------------
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateListDto: UpdateListDto) {
    return await this.listsService.update(id, updateListDto);
  }

  //*------------------------------------------------------------------
  //* Remove List by ID
  //*----------------------------------------------------------------
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.listsService.remove(id);
  }
}
