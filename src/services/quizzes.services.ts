import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { ObjectId } from 'mongodb';

import { ENV_CONFIG } from '~/constants/config';
import { QuizAudience } from '~/constants/enum';
import { CreateQuizReqBody, GetQuizzesReqQuery, UpdateQuizReqBody } from '~/models/requests/Quiz.requests';
import Quiz from '~/models/schemas/Quiz.schema';
import databaseService from './database.services';
import { generateGetQuizzesAggregate } from '~/utils/db';

class QuizzesService {
  // Tạo một quiz mới
  async createQuiz({ body, user_id }: { body: CreateQuizReqBody; user_id: string }) {
    const { insertedId } = await databaseService.quizzes.insertOne(
      new Quiz({
        ...body,
        topic_id: new ObjectId(body.topic_id),
        user_id: new ObjectId(user_id),
        thumbnail: body.thumbnail ? new ObjectId(body.thumbnail) : undefined
      })
    );
    const quiz = await databaseService.quizzes.findOne({ _id: insertedId });
    return {
      quiz
    };
  }

  // Lấy danh sách các quiz
  async getQuizzes(query: GetQuizzesReqQuery) {
    const { name, level, topic, limit, page } = query;
    const _page = Number(page) || 1;
    const _limit = Number(limit) || 20;
    const queryConfig = omitBy(
      {
        name,
        level,
        topic
      },
      isUndefined
    );
    const getQuizzesAggregate = generateGetQuizzesAggregate({
      match: queryConfig,
      skip: (_page - 1) * _limit,
      limit: _limit
    });
    const [quizzes, total] = await Promise.all([
      databaseService.quizzes.aggregate(getQuizzesAggregate).toArray(),
      databaseService.quizzes.countDocuments(queryConfig)
    ]);
    return {
      quizzes,
      page: _page,
      limit: _limit,
      total_rows: total,
      total_pages: Math.ceil(total / _limit)
    };
  }

  // Lấy danh sách các
  async getPublicQuizzes(query: GetQuizzesReqQuery) {
    const { page, limit } = query;
    const _page = Number(page) || 1;
    const _limit = Number(limit) || 20;
    const match = {
      audience: QuizAudience.Everyone
    };
    const getQuizzesAggregate = generateGetQuizzesAggregate({
      match: match,
      skip: (_page - 1) * _limit,
      limit: _limit
    });
    const [quizzes, count] = await Promise.all([
      databaseService.quizzes.aggregate(getQuizzesAggregate).toArray(),
      databaseService.quizzes.countDocuments(match)
    ]);
    return {
      quizzes,
      page: _page,
      limit: _limit,
      total_rows: count,
      total_pages: Math.ceil(count / _limit)
    };
  }

  // Lấy thông tin một quiz
  async getQuiz(quiz_id: string) {
    const quizzes = await databaseService.quizzes
      .aggregate([
        {
          $match: {
            _id: new ObjectId(quiz_id)
          }
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
        }
      ])
      .toArray();
    return {
      quiz: quizzes[0]
    };
  }

  // Cập nhật thông tin một quiz
  async updateQuiz({ quiz_id, body }: { quiz_id: string; body: UpdateQuizReqBody }) {
    const quiz = await databaseService.quizzes.findOneAndUpdate(
      {
        _id: new ObjectId(quiz_id)
      },
      {
        $set: {
          ...omitBy(
            {
              ...body,
              topic_id: body.topic_id ? new ObjectId(body.topic_id) : undefined,
              thumbnail: body.thumbnail ? new ObjectId(body.thumbnail) : undefined
            },
            isUndefined
          )
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    );
    return {
      quiz
    };
  }

  // Xóa quiz (một hoặc nhiều)
  async deleteQuizzes(quiz_ids: string[]) {
    const { deletedCount } = await databaseService.quizzes.deleteMany({
      _id: {
        $in: quiz_ids.map((quiz_id) => new ObjectId(quiz_id))
      }
    });
    return {
      deletedCount
    };
  }

  // Xóa quiz theo id
  async deleteQuiz(quiz_id: string) {
    await databaseService.quizzes.deleteOne({
      _id: new ObjectId(quiz_id)
    });
    return true;
  }

  // Lấy danh sách các bài trắc nghiệm của một user
  async getQuizzesByUserId({ user_id, query }: { user_id: string; query: GetQuizzesReqQuery }) {
    const { name, level, topic, limit, page } = query;
    const _page = Number(page) || 1;
    const _limit = Number(limit) || 20;
    const queryConfig = omitBy(
      {
        user_id: new ObjectId(user_id),
        name,
        level,
        topic
      },
      isUndefined
    );
    const getQuizzesAggregate = generateGetQuizzesAggregate({
      match: queryConfig,
      skip: (_page - 1) * _limit,
      limit: _limit
    });
    const [quizzes, total] = await Promise.all([
      databaseService.quizzes.aggregate(getQuizzesAggregate).toArray(),
      databaseService.quizzes.countDocuments(queryConfig)
    ]);
    return {
      quizzes,
      page: _page,
      limit: _limit,
      total_rows: total,
      total_pages: Math.ceil(total / _limit)
    };
  }
}

const quizzesService = new QuizzesService();
export default quizzesService;
