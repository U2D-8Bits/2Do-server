/* eslint-disable prettier/prettier */


import { IsString, IsEmail } from "class-validator";

export class LoginDto {

    @IsEmail()
    str_user_email: string;

    @IsString()
    str_user_password: string;
}