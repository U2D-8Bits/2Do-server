/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */


//*------------------------------------------------------------------
//* Import Dependency
//*------------------------------------------------------------------
import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindTaskByUserDto } from './dto/find-task-by-user.dto';

//*------------------------------------------------------------------
//* Controller Class
//*------------------------------------------------------------------
@Controller('api/task')
export class TaskController {


  //*------------------------------------------------------------------
  //* Constructor
  //*----------------------------------------------------------------
  constructor(private readonly taskService: TaskService) {}

  //*------------------------------------------------------------------
  //* Method to create a new task
  //*------------------------------------------------------------------
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  //*------------------------------------------------------------------
  //* Method to find all tasks paginated
  //*----------------------------------------------------------------
  @Get()
  findAll(
    @Param('page') page: number,
    @Param('limit') limit: number
  ) {
    const tasks = this.taskService.findAll(Number(page) || 1, Number(limit) || 10);
    return tasks;
  }

  //*------------------------------------------------------------------
  //* Method to find all task paginated by user ID
  //*------------------------------------------------------------------
  @Get('user/:id')
async findAllByUser(
  @Param('id') id: number,
  @Query() query: FindTaskByUserDto,
) {
  return await this.taskService.findAllByUser(
    Number(id),
    query.page || 1,
    query.limit || 10,
    query,
  );
}

  //*------------------------------------------------------------------
  //* Method to find one task
  //*------------------------------------------------------------------
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }

  //*------------------------------------------------------------------
  //* Method to update a task
  //*------------------------------------------------------------------
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(id, updateTaskDto);
  }

  //*------------------------------------------------------------------
  //* Method to remove a task
  //*------------------------------------------------------------------
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskService.removeTask(id);
  }
}
