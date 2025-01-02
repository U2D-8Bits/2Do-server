/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */

//*------------------------------------------------------------------
//* Import Modules
//*------------------------------------------------------------------
import { PartialType } from '@nestjs/mapped-types';
import { CreateSubtaskDto } from './create-subtask.dto';
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

//*------------------------------------------------------------------
//* Create Subtask DTO
//*------------------------------------------------------------------
export class UpdateSubtaskDto extends PartialType(CreateSubtaskDto) {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    str_subtask_title?: string;

    @IsBoolean()
    @IsOptional()
    bln_subtask_completed?: boolean;

}
