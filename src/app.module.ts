/* eslint-disable prettier/prettier */


import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ListsModule } from './lists/lists.module';
import { TaskModule } from './task/task.module';
import { SubtaskModule } from './subtask/subtask.module';


@Module({
  imports: [

    ConfigModule.forRoot({}),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST,
      port: parseInt(process.env.PGPORT),
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }),

    TypeOrmModule.forFeature([]),

    UsersModule,

    ListsModule,

    TaskModule,

    SubtaskModule,

  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
