/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */



import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./interfaces";
import { User } from "./entities/user.entity";

@Injectable()
export class LoginService{

    //* Constructor
    constructor(
        private jwtService: JwtService,
        @InjectRepository(User) private userRepository: Repository<User>,
    ){}

  //?--------------------------------------------------------------------------------
  //? Servicio para generar un token con jwt
  //?--------------------------------------------------------------------------------
  geyJwtToken( payload: JwtPayload ){
    const token = this.jwtService.sign( payload );
    return token;
  }

  //?--------------------------------------------------------------------------------
  //? Servicio para loguear un usuario
  //?--------------------------------------------------------------------------------
}