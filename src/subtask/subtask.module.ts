/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { SubtaskController } from './subtask.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subtask } from './entities/subtask.entity';

@Module({
  imports: [

    TypeOrmModule.forFeature([
      Subtask,
    ]),
  ],
  controllers: [SubtaskController],
  providers: [SubtaskService],
})
export class SubtaskModule {}
