/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
//*-----------------------------------------------------------------------------------------------
//*	Importing Dependency Modules
//*-----------------------------------------------------------------------------------------------

import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

//*-----------------------------------------------------------------------------------------------
//*	Class Validator Imports
//*-----------------------------------------------------------------------------------------------
import {
    IsString,
    IsOptional,
    IsBoolean,
    IsNumber,
    IsDateString,
  } from 'class-validator';


//*-----------------------------------------------------------------------------------------------
//*	Update Task DTO Class
//*-----------------------------------------------------------------------------------------------
export class UpdateTaskDto extends PartialType(CreateTaskDto) {

    @IsOptional()
    @IsString()
    str_task_title: string;

    @IsOptional()
    @IsString()
    str_task_description: string;

    @IsOptional()
    @IsDateString()
    dt_task_due_date: Date;

    @IsOptional()
    @IsBoolean()
    bl_task_completed: boolean;

    @IsOptional()
    @IsNumber()
    int_task_priority: number;

    @IsOptional()
    @IsDateString()
    dt_task_created_at: Date;

}
