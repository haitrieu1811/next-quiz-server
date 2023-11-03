import { ObjectId } from 'mongodb'

interface RefreshTokenConstructor {
  _id?: ObjectId
  token: string
  iat: Date
  exp: Date
  created_at?: Date
  updated_at?: Date
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  iat: Date
  exp: Date
  created_at: Date
  updated_at: Date

  constructor({ _id, token, iat, exp, created_at, updated_at }: RefreshTokenConstructor) {
    const date = new Date()
    this._id = _id
    this.token = token
    this.iat = iat
    this.exp = exp
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
