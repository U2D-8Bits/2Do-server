/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

//*------------------------------------------------------------------
//* Imports
//*------------------------------------------------------------------
import { IsString, IsNumber } from "class-validator";

//*------------------------------------------------------------------
//* CreateListDto
//*------------------------------------------------------------------
export class CreateListDto {

    @IsString()
    str_list_name: string;

    @IsNumber()
    int_user_id: number;
}
