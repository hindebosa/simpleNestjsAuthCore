import { SettingsDto } from "./settings.dto";
// import { PhotoDto } from "../../common/dto/photo.dto";

export class UserDto {
  constructor(object: any) {
    this.name = object.name;
    this.surname = object.surname;
    this.email = object.email;
    this.phone = object.phone;
    this.birthdaydate = object.birthdaydate;

  };
  readonly name: string;
  readonly surname: string;
  readonly email: string;
  readonly phone: string;
  readonly birthdaydate: Date;
}