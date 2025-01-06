/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ List, User ]),
    UsersModule
  ],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
