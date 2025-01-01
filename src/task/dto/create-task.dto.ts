/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
//*-----------------------------------------------------------------------------------------------
//*	Importing Dependency Modules
//*-----------------------------------------------------------------------------------------------

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
//*	Create Task DTO Class
//*-----------------------------------------------------------------------------------------------
export class CreateTaskDto {

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

    //?-----------------------------------------------------------------------------------------------
    //?	Foreign Key Properties - Relationships
    //?-----------------------------------------------------------------------------------------------
    @IsNumber()
    int_user_id: number;
}
