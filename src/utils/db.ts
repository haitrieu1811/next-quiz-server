import { ENV_CONFIG } from '~/constants/config';

export const generateGetQuizzesAggregate = ({
  match,
  skip,
  limit,
  sort = {
    created_at: -1
  }
}: {
  match: any;
  skip: number;
  limit: number;
  sort?: any;
}) => {
  return [
    {
      $match: match
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user_id',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: {
        path: '$author'
      }
    },
    {
      $lookup: {
        from: 'images',
        localField: 'thumbnail',
        foreignField: '_id',
        as: 'thumbnail'
      }
    },
    {
      $unwind: {
        path: '$thumbnail',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'topics',
        localField: 'topic_id',
        foreignField: '_id',
        as: 'topic'
      }
    },
    {
      $unwind: {
        path: '$topic'
      }
    },
    {
      $lookup: {
        from: 'images',
        localField: 'author.avatar',
        foreignField: '_id',
        as: 'author_avatar'
      }
    },
    {
      $unwind: {
        path: '$author_avatar',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'images',
        localField: 'author.cover',
        foreignField: '_id',
        as: 'author_cover'
      }
    },
    {
      $unwind: {
        path: '$author_cover',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        thumbnail_url: {
          $cond: {
            if: '$thumbnail',
            then: {
              $concat: [ENV_CONFIG.AWS_S3_BUCKET_IMAGES_URL, '/', '$thumbnail.name']
            },
            else: ''
          }
        },
        'author.avatar': {
          $cond: {
            if: '$author_avatar',
            then: {
              $concat: [ENV_CONFIG.AWS_S3_BUCKET_IMAGES_URL, '/', '$author_avatar.name']
            },
            else: ''
          }
        },
        'author.cover': {
          $cond: {
            if: '$author_cover',
            then: {
              $concat: [ENV_CONFIG.AWS_S3_BUCKET_IMAGES_URL, '/', '$author_cover.name']
            },
            else: ''
          }
        }
      }
    },
    {
      $group: {
        _id: '$_id',
        name: {
          $first: '$name'
        },
        description: {
          $first: '$description'
        },
        thumbnail: {
          $first: '$thumbnail_url'
        },
        level: {
          $first: '$level'
        },
        audience: {
          $first: '$audience'
        },
        author: {
          $first: '$author'
        },
        topic: {
          $first: '$topic'
        },
        created_at: {
          $first: '$created_at'
        },
        updated_at: {
          $first: '$updated_at'
        }
      }
    },
    {
      $project: {
        'author.password': 0,
        'author.forgot_password_token': 0
      }
    },
    {
      $sort: sort
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ];
};
