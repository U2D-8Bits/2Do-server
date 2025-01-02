/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

//*------------------------------------------------------------------
//* Import Modules
//*------------------------------------------------------------------

import { IsNotEmpty, IsNumber, IsString } from "class-validator";

//*------------------------------------------------------------------
//* DTO Class
//*------------------------------------------------------------------
export class CreateSubtaskDto {

    @IsString()
    @IsNotEmpty()
    str_subtask_title: string;

    @IsNumber()
    @IsNotEmpty()
    int_task_id: number;

}
