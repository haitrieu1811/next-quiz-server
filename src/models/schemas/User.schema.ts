import { ObjectId } from 'mongodb';

import { UserGender, UserRole, UserStatus } from '~/constants/enum';
import { generateRandomString } from '~/utils/common';

interface UserConstructor {
  _id?: ObjectId;
  email: string;
  password: string;
  fullname?: string;
  username?: string;
  avatar?: ObjectId | null;
  cover?: ObjectId | null;
  bio?: string;
  gender?: UserGender;
  date_of_birth?: Date;
  phone_number?: string;
  status?: UserStatus;
  role?: UserRole;
  forgot_password_token?: string;
  created_at?: Date;
  updated_at?: Date;
}

export default class User {
  _id?: ObjectId;
  email: string;
  password: string;
  fullname: string;
  username: string;
  avatar: ObjectId | null;
  cover: ObjectId | null;
  bio: string;
  gender: UserGender;
  date_of_birth: Date;
  phone_number: string;
  status: UserStatus;
  role: UserRole;
  forgot_password_token: string;
  created_at: Date;
  updated_at: Date;

  constructor({
    _id,
    email,
    password,
    fullname,
    username,
    avatar,
    cover,
    bio,
    gender,
    date_of_birth,
    phone_number,
    status,
    role,
    forgot_password_token,
    created_at,
    updated_at
  }: UserConstructor) {
    const date = new Date();
    this._id = _id;
    this.email = email;
    this.password = password;
    this.fullname = fullname || '';
    this.username = username || `Temp${generateRandomString(12)}`;
    this.avatar = avatar || null;
    this.cover = cover || null;
    this.bio = bio || '';
    this.gender = gender || UserGender.Other;
    this.date_of_birth = date_of_birth || date;
    this.phone_number = phone_number || '';
    this.status = status || UserStatus.Active;
    this.role = role || UserRole.User;
    this.forgot_password_token = forgot_password_token || '';
    this.created_at = created_at || date;
    this.updated_at = updated_at || date;
  }
}
