import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

import { ForgottenPassword } from './interfaces/forgottenpassword.interface';
import { UserDto } from '../users/dto/user.dto';
import { JWTService } from 'src/common/services/jwtService';
import { PrismaService } from '../prisma/prisma.service';


const saltRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private mailerService: MailerService,
    private jwtService :JWTService
  ) {}


  async validateLogin(email, password) {
    var userFromDb = await this.prisma.user.findUnique({where:{ email: email}});
    if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);
    if(!userFromDb.validEmail) throw new HttpException('LOGIN.EMAIL_NOT_VERIFIED', HttpStatus.FORBIDDEN);

    var isValidPass = await bcrypt.compare(password, userFromDb.password);

    if(isValidPass){
      var accessToken = await this.jwtService.createToken(email);
      return { token: accessToken, user: new UserDto(userFromDb)}
    } else {
      throw new HttpException('LOGIN.ERROR', HttpStatus.UNAUTHORIZED);
    }

  }

  // async createNewUser(newUser: CreateUserDto): Promise<User> {
  //   if (this.isValidEmail(newUser.email) && newUser.hash) {
  //     var userRegistered = await this.findByEmail(newUser.email);
  //     if (!userRegistered) {
  //       console.log(newUser);
  //       newUser.hash = await bcrypt.hash(newUser.hash, saltRounds);
  //       const user = await this.prisma.user.create({
  //         data: {
  //           ...newUser,
  //         },
  //       });

  //       return await user;
  //     } else if (!userRegistered.validEmail) {
  //       return userRegistered;
  //     } else {
  //       throw new HttpException(
  //         'REGISTRATION.USER_ALREADY_REGISTERED',
  //         HttpStatus.FORBIDDEN,
  //       );
  //     }
  //   } else {
  //     throw new HttpException(
  //       'REGISTRATION.MISSING_MANDATORY_PARAMETERS',
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }
  // }

  // async createEmailToken(email: string): Promise<boolean> {
  //   var emailVerification = await this.prisma.emailVerification.findUnique({
  //     where: { email: email },
  //   });
  //   if (
  //     emailVerification &&
  //     (new Date().getTime() - emailVerification.timestamp.getTime()) / 60000 <
  //       15
  //   ) {
  //     throw new HttpException(
  //       'LOGIN.EMAIL_SENT_RECENTLY',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   } else {
  //     const emailVerificationModel =
  //       await this.prisma.emailVerification.findUnique({ where: { email } });
  //     console.log(emailVerificationModel, 'asdasdasdas');
  //     if (emailVerificationModel === null) {
  //       console.log('in here');
  //       const resulk = await this.prisma.emailVerification.create({
  //         data: {
  //           email: email,
  //           emailToken: (
  //             Math.floor(Math.random() * 9000000) + 1000000
  //           ).toString(),
  //           timestamp: new Date(),
  //         },
  //       });
  //     }
  //     return true;
  //   }
  // }
  // async sendEmailVerification(email: string): Promise<boolean> {
  //   var model = await this.prisma.emailVerification.findUnique({
  //     where: { email },
  //   });
  
  //   if (model && model.emailToken) {
  //     const sent = await this.mailerService.sendMail({
  //       to: email,
  //       from: 'RefuseIt',
  //       subject: 'Welcome to RefuseIT App! Confirm your Email',
  //       html: signupEmailTemplate(model.email, model.email,`http://localhost:3000/auth/verify/${model.emailToken}` ), 
  //     });
  //     return sent;
  //   } else {
  //     throw new HttpException(
  //       'REGISTER.USER_NOT_REGISTERED',
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }
  // }

  // async verifyEmail(token: string): Promise<boolean> {
  //   var emailVerif = await this.prisma.emailVerification.findUnique({
  //     where: { emailToken: token },
  //   });
  //   if (emailVerif && emailVerif.email) {
  //     const userFromDb = await this.prisma.user.findUnique({
  //       where: {
  //         email: emailVerif.email,
  //       },
  //     });

  //     if (userFromDb) {
       
  //       const upsertUser = await this.prisma.user.update({
  //         where: {
  //           email: userFromDb.email,
  //         },
  //         data: {
  //           validEmail: true,
  //         },
  //       });

  //       await this.prisma.emailVerification.delete({
  //         where: {
  //           email: emailVerif.email,
  //         },
  //       })
     
  //       return !!upsertUser;
  //     }
  //   } else {
  //     throw new HttpException(
  //       'LOGIN.EMAIL_CODE_NOT_VALID',
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }
  // }

  // isValidEmail(email: string) {
  //   if (email) {
  //     var re =
  //       /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //     return re.test(email);
  //   } else return false;
  // }

  // async findByEmail(email: string): Promise<User> {
  //   return await this.prisma.user.findUnique({ where: { email: email } });
  // }

  // async createForgottenPasswordToken(email: string): Promise<ForgottenPassword> {
  //   var forgottenPassword= await this.forgottenPasswordModel.findOne({email: email});
  //   if (forgottenPassword && ( (new Date().getTime() - forgottenPassword.timestamp.getTime()) / 60000 < 15 )){
  //     throw new HttpException('RESET_PASSWORD.EMAIL_SENT_RECENTLY', HttpStatus.INTERNAL_SERVER_ERROR);
  //   } else {
  //     var forgottenPasswordModel = await this.forgottenPasswordModel.findOneAndUpdate(
  //       {email: email},
  //       { 
  //         email: email,
  //         newPasswordToken: (Math.floor(Math.random() * (9000000)) + 1000000).toString(), //Generate 7 digits number,
  //         timestamp: new Date()
  //       },
  //       {upsert: true, new: true}
  //     );
  //     if(forgottenPasswordModel){
  //       return forgottenPasswordModel;
  //     } else {
  //       throw new HttpException('LOGIN.ERROR.GENERIC_ERROR', HttpStatus.INTERNAL_SERVER_ERROR);
  //     }
  //   }
  // }

  // async sendEmailForgotPassword(email: string): Promise<boolean> {
  //   var userFromDb = await this.prisma.user.findUnique({where:{ email: email}});
  //   if(!userFromDb) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

  //   var tokenModel = await this.createForgottenPasswordToken(email);

  //   if(tokenModel && tokenModel.newPasswordToken){
  //       let transporter = nodemailer.createTransport({
  //           host: config.mail.host,
  //           port: config.mail.port,
  //           secure: config.mail.secure, // true for 465, false for other ports
  //           auth: {
  //               user: config.mail.user,
  //               pass: config.mail.pass
  //           }
  //       });
    
  //       let mailOptions = {
  //         from: '"Company" <' + config.mail.user + '>', 
  //         to: email, // list of receivers (separated by ,)
  //         subject: 'Frogotten Password', 
  //         text: 'Forgot Password',
  //         html: 'Hi! <br><br> If you requested to reset your password<br><br>'+
  //         '<a href='+ config.host.url + ':' + config.host.port +'/auth/email/reset-password/'+ tokenModel.newPasswordToken + '>Click here</a>'  // html body
  //       };
    
  //       var sent = await new Promise<boolean>(async function(resolve, reject) {
  //         return await transporter.sendMail(mailOptions, async (error, info) => {
  //             if (error) {      
  //               console.log('Message sent: %s', error);
  //               return reject(false);
  //             }
  //             console.log('Message sent: %s', info.messageId);
  //             resolve(true);
  //         });      
  //       })

  //       return sent;
  //   } else {
  //     throw new HttpException('REGISTER.USER_NOT_REGISTERED', HttpStatus.FORBIDDEN);
  //   }
  // }
}
