import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { ObjectId } from 'mongodb';

import { CreateQuizReqBody, GetQuizzesReqQuery, UpdateQuizReqBody } from '~/models/requests/Quiz.requests';
import Quiz from '~/models/schemas/Quiz.schema';
import databaseService from './database.services';

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
    const [quizzes, total] = await Promise.all([
      databaseService.quizzes
        .find(queryConfig)
        .skip((_page - 1) * _limit)
        .limit(_limit)
        .toArray(),
      databaseService.quizzes.countDocuments({})
    ]);
    return {
      quizzes,
      page: _page,
      limit: _limit,
      total_rows: total,
      total_pages: Math.ceil(total / _limit)
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
}

const quizzesService = new QuizzesService();
export default quizzesService;
