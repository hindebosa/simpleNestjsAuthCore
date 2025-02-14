import * as jwt from 'jsonwebtoken';
import { default as config } from '../../config';
import { Injectable } from '@nestjs/common';;
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {User} from '../../modules/users/interfaces/user.interface'
@Injectable()
export class JWTService {
  constructor(private prisma: PrismaService,) { }


  async createToken(email) {
    const expiresIn = config.jwt.expiresIn,
      secretOrKey = config.jwt.secretOrKey;
    const userInfo = { email: email };
    const token = jwt.sign(userInfo, secretOrKey, { expiresIn });
    return {
      expires_in: expiresIn,
      access_token: token,
    };
  }

  async validateUser(signedUser): Promise<User> {
    var userFromDb = await this.prisma.user.findUnique({ where: { email: signedUser.email } });
    if (userFromDb) {
      return userFromDb;
    }
    return null;
  }


}