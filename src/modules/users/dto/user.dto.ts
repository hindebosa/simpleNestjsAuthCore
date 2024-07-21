import { SettingsDto } from "./settings.dto";
// import { PhotoDto } from "../../common/dto/photo.dto";

export class UserDto {
  constructor(object: any) {
    this.firstName = object.firstName;
    this.lastName = object.lastName;
    this.email = object.email;
    this.phoneNumber = object.phoneNumber;
  };
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber: string;

}