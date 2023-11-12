import isUndefined from 'lodash/isUndefined';
import omit from 'lodash/omit';
import omitBy from 'lodash/omitBy';
import { ObjectId, WithId } from 'mongodb';

import { ENV_CONFIG } from '~/constants/config';
import { TokenType, UserRole } from '~/constants/enum';
import { RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.requests';
import RefreshToken from '~/models/schemas/RefreshToken.schema';
import User, { UserResult } from '~/models/schemas/User.schema';
import { hashPassword } from '~/utils/crypto';
import { signToken, verifyToken } from '~/utils/jwt';
import databaseService from './database.services';

class UsersService {
  // Giải mã refresh token
  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: ENV_CONFIG.JWT_SECRET_REFRESH_TOKEN
    });
  }

  // Tạo access token
  async signAccessToken({ user_id, role }: { user_id: string; role: UserRole }) {
    return signToken({
      payload: {
        user_id,
        role,
        token_type: TokenType.AccessToken
      },
      privateKey: ENV_CONFIG.JWT_SECRET_ACCESS_TOKEN,
      options: {
        expiresIn: ENV_CONFIG.ACCESS_TOKEN_EXPIRES_IN
      }
    });
  }

  // Tạo refresh token
  async signRefreshToken({ user_id, role, exp }: { user_id: string; role: UserRole; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          role,
          token_type: TokenType.RefreshToken,
          exp
        },
        privateKey: ENV_CONFIG.JWT_SECRET_REFRESH_TOKEN
      });
    }
    return signToken({
      payload: {
        user_id,
        role,
        token_type: TokenType.RefreshToken
      },
      privateKey: ENV_CONFIG.JWT_SECRET_REFRESH_TOKEN,
      options: {
        expiresIn: ENV_CONFIG.REFRESH_TOKEN_EXPIRES_IN
      }
    });
  }

  // Tạo access và refresh token
  async signAccessAndRefreshToken({
    user_id,
    role,
    refresh_exp
  }: {
    user_id: string;
    role: UserRole;
    refresh_exp?: number;
  }) {
    return Promise.all([
      this.signAccessToken({ user_id, role }),
      this.signRefreshToken({ user_id, role, exp: refresh_exp })
    ]);
  }

  // Đăng ký
  async register({ email, password }: RegisterReqBody) {
    const user_id = new ObjectId();
    const [, [access_token, refresh_token]] = await Promise.all([
      databaseService.users.insertOne(
        new User({
          _id: user_id,
          email,
          password: hashPassword(password)
        })
      ),
      this.signAccessAndRefreshToken({
        user_id: user_id.toString(),
        role: UserRole.User
      })
    ]);
    const { iat, exp } = await this.decodeRefreshToken(refresh_token);
    const [, user] = await Promise.all([
      databaseService.refresh_tokens.insertOne(
        new RefreshToken({
          token: refresh_token,
          iat,
          exp
        })
      ),
      this.getUserById(user_id.toString())
    ]);
    return {
      user,
      access_token,
      refresh_token
    };
  }

  // Đăng nhập
  async login({ user_id, role }: { user_id: string; role: UserRole }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      role
    });
    const { iat, exp } = await this.decodeRefreshToken(refresh_token);
    await databaseService.refresh_tokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        iat,
        exp
      })
    );
    return {
      access_token,
      refresh_token
    };
  }

  // Đăng xuất
  async logout(refresh_token: string) {
    await databaseService.refresh_tokens.deleteOne({
      token: refresh_token
    });
    return;
  }

  // Refresh token
  async refreshToken({
    user_id,
    role,
    refresh_exp,
    refresh_token
  }: {
    user_id: string;
    role: UserRole;
    refresh_exp?: number;
    refresh_token: string;
  }) {
    const [new_access_token, new_refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
      role,
      refresh_exp
    });
    const { iat, exp } = await this.decodeRefreshToken(refresh_token);
    await Promise.all([
      databaseService.refresh_tokens.deleteOne({
        token: refresh_token
      }),
      databaseService.refresh_tokens.insertOne(
        new RefreshToken({
          token: new_refresh_token,
          iat,
          exp
        })
      )
    ]);
    return {
      new_access_token,
      new_refresh_token
    };
  }

  // Lấy thông tin người dùng theo id
  async getUserById(user_id: string) {
    const users = await databaseService.users
      .aggregate<UserResult>([
        {
          $match: {
            _id: new ObjectId(user_id)
          }
        },
        {
          $lookup: {
            from: 'images',
            localField: 'avatar',
            foreignField: '_id',
            as: 'avatar'
          }
        },
        {
          $unwind: {
            path: '$avatar',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'images',
            localField: 'cover',
            foreignField: '_id',
            as: 'cover'
          }
        },
        {
          $unwind: {
            path: '$cover',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            avatar_url: {
              $concat: [ENV_CONFIG.AWS_S3_BUCKET_IMAGES_URL, '/', '$avatar.name']
            },
            cover_url: {
              $concat: [ENV_CONFIG.AWS_S3_BUCKET_IMAGES_URL, '/', '$cover.name']
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            email: {
              $first: '$email'
            },
            fullname: {
              $first: '$fullname'
            },
            username: {
              $first: '$username'
            },
            avatar_url: {
              $first: '$avatar_url'
            },
            cover_url: {
              $first: '$cover_url'
            },
            bio: {
              $first: '$bio'
            },
            gender: {
              $first: '$gender'
            },
            phone_number: {
              $first: '$phone_number'
            },
            date_of_birth: {
              $first: '$date_of_birth'
            },
            status: {
              $first: '$status'
            },
            role: {
              $first: '$role'
            },
            created_at: {
              $first: '$created_at'
            },
            updated_at: {
              $first: '$updated_at'
            }
          }
        }
      ])
      .toArray();
    return users[0];
  }

  // Lấy thông tin người dùng theo username
  async getUserByUsername(username: string) {
    const users = await databaseService.users
      .aggregate<UserResult>([
        {
          $match: {
            username
          }
        },
        {
          $lookup: {
            from: 'images',
            localField: 'avatar',
            foreignField: '_id',
            as: 'avatar'
          }
        },
        {
          $unwind: {
            path: '$avatar',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'images',
            localField: 'cover',
            foreignField: '_id',
            as: 'cover'
          }
        },
        {
          $unwind: {
            path: '$cover',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            avatar_url: {
              $concat: [ENV_CONFIG.AWS_S3_BUCKET_IMAGES_URL, '/', '$avatar.name']
            },
            cover_url: {
              $concat: [ENV_CONFIG.AWS_S3_BUCKET_IMAGES_URL, '/', '$cover.name']
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            email: {
              $first: '$email'
            },
            fullname: {
              $first: '$fullname'
            },
            username: {
              $first: '$username'
            },
            avatar_url: {
              $first: '$avatar_url'
            },
            cover_url: {
              $first: '$cover_url'
            },
            bio: {
              $first: '$bio'
            },
            gender: {
              $first: '$gender'
            },
            phone_number: {
              $first: '$phone_number'
            },
            date_of_birth: {
              $first: '$date_of_birth'
            },
            status: {
              $first: '$status'
            },
            role: {
              $first: '$role'
            },
            created_at: {
              $first: '$created_at'
            },
            updated_at: {
              $first: '$updated_at'
            }
          }
        }
      ])
      .toArray();
    return users[0];
  }

  // Lấy thông tin người dùng hiện tại (chỉ khi đã đăng nhập)
  async getMe(user_id: string) {
    const user = await this.getUserById(user_id);
    return user;
  }

  // Cập nhật thông tin người dùng hiện tại
  async updateMe({ body, user_id }: { body: UpdateMeReqBody; user_id: string }) {
    const updateConfig = omitBy(
      {
        avatar: body.avatar ? new ObjectId(body.avatar) : undefined,
        cover: body.cover ? new ObjectId(body.cover) : undefined
      },
      isUndefined
    );
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          ...omit(body, ['avatar', 'cover']),
          ...updateConfig
        },
        $currentDate: {
          updated_at: true
        }
      }
    );
    const user = await this.getUserById(user_id);
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id: (user as WithId<UserResult>)._id.toString(),
      role: (user as WithId<UserResult>).role
    });
    return {
      user,
      access_token,
      refresh_token
    };
  }

  // Đổi mật khẩu
  async changePassword({ new_password, user_id }: { new_password: string; user_id: string }) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hashPassword(new_password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    );
    return;
  }
}

const usersService = new UsersService();
export default usersService;
