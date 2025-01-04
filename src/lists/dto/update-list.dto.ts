/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

//*------------------------------------------------------------------
//* Imports
//*------------------------------------------------------------------
import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import { IsString, IsOptional } from 'class-validator';

//*------------------------------------------------------------------
//* Class Declaration and Export
//*------------------------------------------------------------------
export class UpdateListDto extends PartialType(CreateListDto) {

    @IsString()
    @IsOptional()
    str_list_name?: string;
}
