/* eslint-disable prettier/prettier */


import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { UsersModule } from './users/users.module';


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

  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
