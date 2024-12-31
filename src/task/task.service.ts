/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

//*------------------------------------------------------------------
//* Import Dependency
//*------------------------------------------------------------------
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

//*------------------------------------------------------------------
//* Service Class
//*------------------------------------------------------------------
@Injectable()
export class TaskService {
  //*------------------------------------------------------------------
  //* Constructor
  //*------------------------------------------------------------------
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //*------------------------------------------------------------------
  //* Method to create a new task
  //*------------------------------------------------------------------
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const { int_user_id, ...content } = createTaskDto;

      const userFound = await this.userRepository.findOne({
        where: { int_user_id },
      });

      if (!userFound) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      //? Create a new task
      const task = this.taskRepository.create({
        ...content,
        user: userFound,
      });

      //? Save the task
      return await this.taskRepository.save(task);
    } catch (error) {
      //? Throw error
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Method to find all tasks paginated
  //*------------------------------------------------------------------
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{ tasks: Task[]; total: number }> {
    try {
      if (page < 1 || limit < 1) {
        throw new HttpException(
          'Invalid page or limit value',
          HttpStatus.BAD_REQUEST,
        );
      }

      const [tasks, total] = await this.taskRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['user'],
      });

      //? Return tasks with total count and user details
      return {
        tasks,
        total,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Method to find one task by id
  //*----------------------------------------------------------------
  async findOne(int_task_id: number): Promise<Task> {
    try {
      //? Find one task
      const task = await this.taskRepository.findOne({
        where: { int_task_id },
        relations: ['user'],
      });

      //? If task not found
      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      //? Return task
      return task;
    } catch (error) {
      //? Throw error
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Method to update a task by id
  //*------------------------------------------------------------------
  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { int_task_id: id },
      relations: ['user'],
    });

    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    try {
      const taskUpdated = await Object.assign(task, updateTaskDto);

      return await this.taskRepository.save(taskUpdated);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Method to remove a task by id
  //*------------------------------------------------------------------
  async removeTask(int_task_id: number): Promise<{ message: string }> {
    try {
      const task = await this.taskRepository.findOne({
        where: { int_task_id },
        relations: ['user'],
      });

      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      await this.taskRepository.delete(task.int_task_id);

      return {
        message: 'Task deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
