import { Body, Controller, Post } from '@nestjs/common';

import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { Login } from './interfaces/login.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @Post('login')
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
}
