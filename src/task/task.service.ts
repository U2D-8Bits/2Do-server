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
import { List } from 'src/lists/entities/list.entity';

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
    @InjectRepository(List) private listRepository: Repository<List>,
  ) {}

  //*------------------------------------------------------------------
  //* Method to create a new task
  //*------------------------------------------------------------------
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const { int_user_id, int_list_id, ...content } = createTaskDto;

      const userFound = await this.userRepository.findOne({
        where: { int_user_id },
      });

      if (!userFound) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      let list = null;

      if (int_list_id) {
        list = await this.listRepository.findOne({
          where: { int_list_id },
        });

        if (!list) {
          throw new HttpException('List not found', HttpStatus.NOT_FOUND);
        }
      }

      //? Create a new task
      const task = this.taskRepository.create({
        ...content,
        user: userFound,
        list: list,
      });

      //? Save the task
      return await this.taskRepository.save(task);
    } catch (error) {
      //? Throw error
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Method to find all tasks by List ID
  //*------------------------------------------------------------------
  async findAllByList(int_list_id: number): Promise<Task[]> {
    const list = await this.listRepository.findOne({
      where: { int_list_id },
    });

    if (!list) {
      throw new HttpException('List not found', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.taskRepository.find({
        where: { list: {int_list_id} },
        relations: ['user', 'subtasks'],
      });
    } catch (error) {
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
        relations: ['user', 'subtasks'],
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
  //* Method to find all tasks by user id with pagination and filter
  //*------------------------------------------------------------------
  async findAllByUser(
    int_user_id: number,
    page = 1,
    limit = 10,
    filters?: { completed?: boolean; priority?: number; dueDate: string },
  ): Promise<{ tasks: Task[]; total: number }> {
    const queryBuilder = this.taskRepository.createQueryBuilder('task');

    try {
      //? Filter user
      queryBuilder
        .andWhere('task.user.int_user_id = :int_user_id', { int_user_id })
        .leftJoinAndSelect('task.user', 'user')
        .leftJoinAndSelect('task.subtasks', 'subtasks');

      //? Dynamic filters
      if (filters?.completed !== undefined) {
        queryBuilder.andWhere('task.bl_task_completed = :completed', {
          completed: filters.completed,
        });
      }

      if (filters?.priority) {
        queryBuilder.andWhere('task.int_task_priority = :priority', {
          priority: filters.priority,
        });
      }

      if (filters?.dueDate) {
        if (isNaN(Date.parse(filters.dueDate))) {
          throw new HttpException(
            'Invalid date format for dueDate',
            HttpStatus.BAD_REQUEST,
          );
        }
        queryBuilder.andWhere('task.dt_task_due_date = :dueDate', {
          dueDate: filters.dueDate,
        });
      }

      // Contar total de resultados
      const total = await queryBuilder.getCount();

      // Aplicar paginación y ordenación
      const tasks = await queryBuilder
        .orderBy('task.dt_task_created_at', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      return { tasks, total };
    } catch (error) {
      throw new HttpException(
        `Database error: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        relations: ['user', 'subtasks'],
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
      relations: ['user', 'subtasks'],
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
