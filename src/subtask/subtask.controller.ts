/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

//*------------------------------------------------------------------
//* Import Modules
//*------------------------------------------------------------------
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

//*------------------------------------------------------------------
//* Controller
//*------------------------------------------------------------------
@Controller('api/subtask')
export class SubtaskController {

  //*------------------------------------------------------------------
  //* Constructor
  //*------------------------------------------------------------------
  constructor(private readonly subtaskService: SubtaskService) {}


  //*------------------------------------------------------------------
  //* Create Subtask
  //*------------------------------------------------------------------
  @Post()
  create(@Body() createSubtaskDto: CreateSubtaskDto) {
    return this.subtaskService.create(createSubtaskDto);
  }

  //*------------------------------------------------------------------
  //* Find All Subtask by Task ID
  //*----------------------------------------------------------------
  @Get('by-task/:id')
  findAll(
    @Param('id') id: number
  ) {
    return this.subtaskService.findAll(id);
  }

  //*------------------------------------------------------------------
  //* Find One Subtask
  //*------------------------------------------------------------------
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.subtaskService.findOne(id);
  }

  //*------------------------------------------------------------------
  //* Update Subtask
  //*------------------------------------------------------------------
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSubtaskDto: UpdateSubtaskDto) {
    return this.subtaskService.update(id, updateSubtaskDto);
  }

  //*------------------------------------------------------------------
  //* Remove Subtask
  //*------------------------------------------------------------------
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.subtaskService.remove(id);
  }
}
