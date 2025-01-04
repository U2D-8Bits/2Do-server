/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

//*------------------------------------------------------------------
//* Imports
//*------------------------------------------------------------------
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

//*------------------------------------------------------------------
//* Service Class
//*------------------------------------------------------------------
@Injectable()
export class ListsService {
  //*------------------------------------------------------------------
  //* Constructor
  //*------------------------------------------------------------------
  constructor(
    @InjectRepository(List) private listRepository: Repository<List>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //*------------------------------------------------------------------
  //* Create List
  //*------------------------------------------------------------------
  async create(createListDto: CreateListDto): Promise<List> {
    const { int_user_id } = createListDto;

    try {
      const user = await this.userRepository.findOne({
        where: { int_user_id },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const list = await this.listRepository.create(createListDto);

      await this.listRepository.save(list);

      return list;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Find All Lists by User ID
  //*------------------------------------------------------------------
  async findAll(int_user_id: number): Promise<List[]> {
    const user = await this.userRepository.findOne({
      where: { int_user_id },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    try {
      const lists = await this.listRepository.find({
        where: { user },
      });

      if (lists.length === 0) {
        throw new HttpException('Lists not found', HttpStatus.NOT_FOUND);
      }

      return lists;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Find One List by ID
  //*------------------------------------------------------------------
  async findOne(id: number): Promise<List> {
    try {
      const list = await this.listRepository.findOne({
        where: { int_list_id: id },
      });

      if (!list) {
        throw new HttpException('List not found', HttpStatus.NOT_FOUND);
      }

      return list;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Update List by ID
  //*------------------------------------------------------------------
  async update(id: number, updateListDto: UpdateListDto): Promise<List> {
    const list = await this.listRepository.findOne({
      where: { int_list_id: id },
    });

    if (!list) {
      throw new HttpException(
        `List with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const updatedList = await Object.assign(list, updateListDto);

      await this.listRepository.save(updatedList);

      return updatedList;
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Remove List by ID
  //*------------------------------------------------------------------
  async remove(id: number): Promise<{ message: string }> {

    if (!this.listExists(id)) {
      throw new HttpException(
        `List with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.listRepository.delete(id);

      return { message: `List with ID ${id} has been deleted` };
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  //*------------------------------------------------------------------
  //* Check if List Exists
  //*------------------------------------------------------------------
  async listExists(int_list_id: number): Promise<boolean> {
    const list = await this.listRepository.findOne({
      where: { int_list_id },
    });

    if (!list) {
      return false;
    }

    return true;
  }
}
