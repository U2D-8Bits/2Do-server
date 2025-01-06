/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { ListsModule } from 'src/lists/lists.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { List } from 'src/lists/entities/list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Task, User, List ]),
    ListsModule,
    UsersModule
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
