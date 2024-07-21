export interface User {
    validEmail:boolean
    firstName:  string
    lastName: string
    phoneNumber: string
    verified: boolean
    email :string
    password: String
    images?:   Image[] 
  }

  export interface Image{
    filename   :string
    url        :string
  }