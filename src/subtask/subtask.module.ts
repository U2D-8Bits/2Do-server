/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { SubtaskController } from './subtask.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subtask } from './entities/subtask.entity';
import { TaskModule } from 'src/task/task.module';
import { Task } from 'src/task/entities/task.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([
      Subtask,
      Task
    ]),
    TaskModule
  ],
  controllers: [SubtaskController],
  providers: [SubtaskService],
})
export class SubtaskModule {}
