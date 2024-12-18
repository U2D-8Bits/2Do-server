/* eslint-disable prettier/prettier */
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    str_user_username: string;

    @IsEmail()
    str_user_email: string;

    @IsString()
    @MinLength(8)
    str_user_password: string;
}
