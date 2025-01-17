/* eslint-disable prettier/prettier */
import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3, {
    message: 'El nombre de usuario debe tener al menos 3 caracteres',
  })
  @MaxLength(30, {
    message: 'El nombre de usuario no puede tener más de 30 caracteres',
  })
  @Trim()
  str_user_username: string;

  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @Trim()
  str_user_email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(20, {
    message: 'La contraseña no puede tener más de 20 caracteres',
  })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)',
  })
  @Trim()
  str_user_password: string;

  @IsString()
  @MinLength(8, {
    message: 'La confirmación de la contraseña debe tener al menos 8 caracteres',
  })
  @MaxLength(20, {
    message: 'La confirmación de la contraseña no puede tener más de 20 caracteres',
  })
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
    message:
      'La confirmación de la contraseña debe incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)',
  })
  @Trim()
  str_user_password_confirm: string;
}
