/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class UpdateImgUserDto extends PartialType(CreateUserDto) {
    

    //* Implementamos validadores de Validators
    @IsString()
    @IsNotEmpty({ message: 'El campo de imagen no puede estar vacío' })
    @IsOptional()
    str_user_profile_picture: string;

}