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
@Controller('lists')
export class ListsController {

  //*------------------------------------------------------------------
  //* Constructor
  //*----------------------------------------------------------------
  constructor(private readonly listsService: ListsService) {}

  //*------------------------------------------------------------------
  //* Create List
  //*------------------------------------------------------------------
  @Post()
  create(@Body() createListDto: CreateListDto) {
    return this.listsService.create(createListDto);
  }

  //*------------------------------------------------------------------
  //* Find All Lists by User ID
  //*------------------------------------------------------------------
  @Get('user/:id')
  findAll(
    @Param('id') id: number
  ) {
    return this.listsService.findAll(id);
  }

  //*------------------------------------------------------------------
  //* Find One List by ID
  //*----------------------------------------------------------------
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.listsService.findOne(id);
  }

  //*------------------------------------------------------------------
  //* Update List by ID
  //*------------------------------------------------------------------
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(id, updateListDto);
  }

  //*------------------------------------------------------------------
  //* Remove List by ID
  //*----------------------------------------------------------------
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.listsService.remove(id);
  }
}
