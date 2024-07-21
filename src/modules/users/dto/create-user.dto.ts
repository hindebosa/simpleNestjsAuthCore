export class CreateUserDto {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly phoneNumber: string;
  password: string;

}

export class Image{
  filename   :string
  url        :string
}