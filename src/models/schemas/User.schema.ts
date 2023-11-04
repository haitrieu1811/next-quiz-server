import { ObjectId } from 'mongodb';
import { UserGender, UserStatus } from '~/constants/enum';

interface UserConstructor {
  _id?: ObjectId;
  email: string;
  password: string;
  fullname?: string;
  gender?: UserGender;
  date_of_birth?: Date;
  phone_number?: string;
  status?: UserStatus;
  forgot_password_token?: string;
  created_at?: Date;
  updated_at?: Date;
}

export default class User {
  _id?: ObjectId;
  email: string;
  password: string;
  fullname: string;
  gender: UserGender;
  date_of_birth: Date;
  phone_number: string;
  status: UserStatus;
  forgot_password_token: string;
  created_at: Date;
  updated_at: Date;

  constructor({
    _id,
    email,
    password,
    fullname,
    gender,
    date_of_birth,
    phone_number,
    status,
    forgot_password_token,
    created_at,
    updated_at
  }: UserConstructor) {
    const date = new Date();
    this._id = _id;
    this.email = email;
    this.password = password;
    this.fullname = fullname || '';
    this.gender = gender || UserGender.Other;
    this.date_of_birth = date_of_birth || date;
    this.phone_number = phone_number || '';
    this.status = status || UserStatus.Active;
    this.forgot_password_token = forgot_password_token || '';
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
  }
}
