import { ObjectId } from 'mongodb';

import { ENV_CONFIG } from '~/constants/config';
import { PaginationReqQuery } from '~/models/requests/Common.requests';
import { CreateQuestionReqBody } from '~/models/requests/Question.requests';
import Question from '~/models/schemas/Question.schema';
import databaseService from './database.services';

class QuestionsService {
  // Tạo câu hỏi
  async createQuestion({ body, user_id }: { body: CreateQuestionReqBody; user_id: string }) {
    const { insertedId } = await databaseService.questions.insertOne(
      new Question({
        ...body,
        quiz_id: new ObjectId(body.quiz_id),
        user_id: new ObjectId(user_id),
        images: body.images?.map((image) => new ObjectId(image))
      })
    );
    const question = await databaseService.questions.findOne({ _id: insertedId });
    return {
      question
    };
  }

  // Lấy danh sách câu hỏi theo id của bài quiz
  async getQuestionsByQuizId({ quizId, query }: { quizId: string; query: PaginationReqQuery }) {
    const { page, limit } = query;
    const _page = Number(page) || 1;
    const _limit = Number(limit) || 20;
    const [questions, total] = await Promise.all([
      databaseService.questions
        .aggregate([
          {
            $match: {
              quiz_id: new ObjectId(quizId)
            }
          },
          {
            $lookup: {
              from: 'images',
              localField: 'images',
              foreignField: '_id',
              as: 'images'
            }
          },
          {
            $unwind: {
              path: '$images',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $addFields: {
              'images.url': {
                $concat: [ENV_CONFIG.AWS_S3_BUCKET_IMAGES_URL, '/', '$images.name']
              }
            }
          },
          {
            $addFields: {
              images: {
                $cond: {
                  if: '$images.url',
                  then: '$images',
                  else: []
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
              answers: {
                $first: '$answers'
              },
              images: {
                $push: '$images'
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
            $addFields: {
              images: {
                $filter: {
                  input: '$images',
                  as: 'image',
                  cond: {
                    $ne: ['$$image', []]
                  }
                }
              }
            }
          },
          {
            $project: {
              'images.name': 0,
              'images.created_at': 0,
              'images.updated_at': 0
            }
          },
          {
            $sort: {
              created_at: -1
            }
          },
          {
            $skip: (_page - 1) * _limit
          },
          {
            $limit: _limit
          }
        ])
        .toArray(),
      databaseService.questions.countDocuments({ quiz_id: new ObjectId(quizId) })
    ]);
    return {
      questions,
      page: _page,
      limit: _limit,
      total_rows: total,
      total_pages: Math.ceil(total / _limit)
    };
  }

  // Cập nhật câu hỏi
  async updateQuestion({ questionId, body }: { questionId: string; body: Omit<CreateQuestionReqBody, 'user_id'> }) {
    const { images } = body;
    const question = await databaseService.questions.findOneAndUpdate(
      { _id: new ObjectId(questionId) },
      {
        $set: {
          ...body,
          quiz_id: new ObjectId(body.quiz_id),
          images: images && images.length ? images.map((image) => new ObjectId(image)) : undefined
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
      question
    };
  }

  // Xóa câu hỏi (một hoặc nhiều)
  async deleteQuestions(questionIds: string[]) {
    const { deletedCount } = await databaseService.questions.deleteMany({
      _id: {
        $in: questionIds.map((questionId) => new ObjectId(questionId))
      }
    });
    return {
      deletedCount
    };
  }

  // Lấy thông tin câu hỏi
  async getQuestion(questionId: string) {
    const questions = await databaseService.questions
      .aggregate([
        {
          $match: {
            _id: new ObjectId(questionId)
          }
        },
        {
          $lookup: {
            from: 'images',
            localField: 'images',
            foreignField: '_id',
            as: 'images'
          }
        },
        {
          $unwind: {
            path: '$images',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $addFields: {
            'images.url': {
              $cond: {
                if: '$images',
                then: {
                  $concat: [ENV_CONFIG.AWS_S3_BUCKET_IMAGES_URL, '/', '$images.name']
                },
                else: null
              }
            }
          }
        },
        {
          $addFields: {
            images: {
              $cond: {
                if: '$images.url',
                then: '$images',
                else: []
              }
            }
          }
        },
        {
          $group: {
            _id: '$_id',
            quiz_id: {
              $first: '$quiz_id'
            },
            name: {
              $first: '$name'
            },
            description: {
              $first: '$description'
            },
            images: {
              $push: '$images'
            },
            answers: {
              $first: '$answers'
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
          $addFields: {
            images: {
              $filter: {
                input: '$images',
                as: 'image',
                cond: {
                  $ne: ['$$image', []]
                }
              }
            }
          }
        },
        {
          $project: {
            'images.name': 0,
            'images.created_at': 0,
            'images.updated_at': 0
          }
        }
      ])
      .toArray();
    return {
      question: questions[0]
    };
  }

  // Xóa hình ảnh của câu hỏi
  async deleteImageOfQuestion({ questionId, imageId }: { questionId: string; imageId: string }) {
    const question = await databaseService.questions.findOneAndUpdate(
      {
        _id: new ObjectId(questionId)
      },
      {
        $pull: {
          images: new ObjectId(imageId)
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
      question
    };
  }
}

const questionsService = new QuestionsService();
export default questionsService;
