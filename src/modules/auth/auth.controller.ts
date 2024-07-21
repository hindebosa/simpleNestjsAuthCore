import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { Login } from './interfaces/login.interface';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('login')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() login: Login){
        try {
            var response = await this.authService.validateLogin(
              login.email,
              login.hash,
            );
            return new ResponseSuccess('LOGIN.SUCCESS', response);
          } catch (error) {
            return new ResponseError('LOGIN.ERROR', error);
          }
    }

    @Post("signup")
    @HttpCode(HttpStatus.OK)
    public async signup(@Body() createUserDto:CreateUserDto) {
      try{
        const newUser = new UserDto(await this.authService.createNewUser(createUserDto));
     if(newUser)   {
          return new ResponseSuccess("REGISTRATION.USER_REGISTERED_SUCCESSFULLY");
        }  
      }catch(error){
        return new ResponseError("REGISTRATION.ERROR.GENERIC_ERROR", error);
      }

    }
}
