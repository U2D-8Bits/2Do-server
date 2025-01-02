/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

//*------------------------------------------------------------------
//* Import Modules
//*------------------------------------------------------------------

import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

//*------------------------------------------------------------------
//* DTO Class
//*------------------------------------------------------------------
export class CreateSubtaskDto {

    @IsString()
    @IsNotEmpty()
    str_subtask_title: string;

    @IsBoolean()
    @IsNotEmpty()
    bln_subtask_completed: boolean;

    @IsNumber()
    @IsNotEmpty()
    int_task_id: number;

}
