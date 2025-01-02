/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

//*------------------------------------------------------------------
//* Import Modules
//*------------------------------------------------------------------
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Subtask } from './entities/subtask.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/task/entities/task.entity';

//*------------------------------------------------------------------
//* Service
//*------------------------------------------------------------------
@Injectable()
export class SubtaskService {
  //*------------------------------------------------------------------
  //* constructor
  //*------------------------------------------------------------------

  constructor(
    @InjectRepository(Subtask) private subtaskRepository: Repository<Subtask>,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  //*------------------------------------------------------------------
  //* Create Substask
  //*------------------------------------------------------------------
  async create(createSubtaskDto: CreateSubtaskDto): Promise<Subtask> {
    const { int_task_id } = createSubtaskDto;

    const task = await this.taskRepository.findOne({
      where: { int_task_id },
    });

    //? Verify if the task exists
    if (!task) {
      throw new HttpException(
        `Task with ID ${int_task_id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const subtask = await this.subtaskRepository.create(createSubtaskDto);
      return this.subtaskRepository.save(subtask);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //*------------------------------------------------------------------
  //* Find All Subtask by Task ID
  //*------------------------------------------------------------------
  async findAll(int_task_id: number): Promise<Subtask[]> {
    //? Veriffy if the task exists
    const task = await this.taskRepository.findOne({
      where: { int_task_id },
    });

    if (!task) {
      throw new HttpException(
        `Task with ID ${int_task_id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      //?Verify if subtasks exists
      const subtasks = await this.subtaskRepository.find();

      if (!subtasks) {
        throw new HttpException(`Subtasks not found`, HttpStatus.NOT_FOUND);
      }

      return subtasks;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //*------------------------------------------------------------------
  //* Find One Subtask by ID
  //*------------------------------------------------------------------
  async findOne(id: number): Promise<Subtask> {
    const subtask = await this.subtaskRepository.findOne({
      where: { int_subtask_id: id },
      relations: ['task'],
    });

    if (!subtask) {
      throw new HttpException(
        `Subtask with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      return subtask;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //*------------------------------------------------------------------
  //* Update Subtask by ID
  //*------------------------------------------------------------------
  async update(id: number, updateSubtaskDto: UpdateSubtaskDto) {
    const subtask = await this.subtaskRepository.findOne({
      where: { int_subtask_id: id },
      relations: ['task'],
    });

    if (!subtask) {
      throw new HttpException(
        `Subtask with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const subtaskUpdated = await Object.assign(subtask, updateSubtaskDto);

      await this.subtaskRepository.save(subtaskUpdated);

      return subtaskUpdated;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  //*------------------------------------------------------------------
  //* Remove Subtask by ID
  //*----------------------------------------------------------------
  async remove(id: number): Promise<{ message: string }> {
    const subtask = await this.subtaskRepository.findOne({
      where: { int_subtask_id: id },
    });

    if (!subtask) {
      throw new HttpException(
        `Subtask with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.subtaskRepository.remove(subtask);

      return { message: `Subtask with ID ${id} removed` };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
