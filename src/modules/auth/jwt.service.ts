import * as jwt from 'jsonwebtoken';
import { default as config } from '../../config';
import { Injectable } from '@nestjs/common';
import { User } from '../../modules/users/interfaces/user.interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JWTService {
  constructor(private prisma: PrismaService,) { }


  async createToken(email, roles) {
    const expiresIn = config.jwt.expiresIn,
      secretOrKey = config.jwt.secretOrKey;
    const userInfo = { email: email, roles: roles };
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async validateUser(signedUser) {
    var userFromDb = await this.prisma.user.findUnique({ where: { email: signedUser.email } });
    if (userFromDb) {
      return userFromDb;
    }
    return null;
  }


}
