import { ObjectId } from 'mongodb'

interface UserConstructor {
  _id?: ObjectId
  email: string
  password: string
  gender?: UserGender
  date_of_birth?: Date
  phone_number?: string
  verify_status?: UserVerifyStatus
  status?: UserStatus
  email_verify_token?: string
  forgot_password_token?: string
  created_at?: Date
  updated_at?: Date
}

export default class User {
  _id?: ObjectId
  email: string
  password: string
  gender: UserGender
  date_of_birth: Date
  phone_number: string
  verify_status: UserVerifyStatus
  status: UserStatus
  email_verify_token: string
  forgot_password_token: string
  created_at: Date
  updated_at: Date

  constructor({
    _id,
    email,
    password,
    gender,
    date_of_birth,
    phone_number,
    verify_status,
    status,
    email_verify_token,
    forgot_password_token,
    created_at,
    updated_at
  }: UserConstructor) {
    const date = new Date()
    this._id = _id
    this.email = email
    this.password = password
    this.gender = gender || UserGender.Other
    this.date_of_birth = date_of_birth || date
    this.phone_number = phone_number || ''
    this.verify_status = verify_status || UserVerifyStatus.Unverified
    this.status = status || UserStatus.Active
    this.email_verify_token = email_verify_token || ''
    this.forgot_password_token = forgot_password_token || ''
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
