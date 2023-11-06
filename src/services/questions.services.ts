import { ObjectId } from 'mongodb';

import { CreateQuestionReqBody } from '~/models/requests/Question.requests';
import Question from '~/models/schemas/Question.schema';
import databaseService from './database.services';
import { PaginationReqQuery } from '~/models/requests/Common.requests';

class QuestionsService {
  // Tạo câu hỏi
  async createQuestion(body: CreateQuestionReqBody) {
    const { insertedId } = await databaseService.questions.insertOne(
      new Question({
        ...body,
        quiz_id: new ObjectId(body.quiz_id)
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
        .find({ quiz_id: new ObjectId(quizId) })
        .skip((_page - 1) * _limit)
        .limit(_limit)
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
  async updateQuestion({ questionId, body }: { questionId: string; body: CreateQuestionReqBody }) {
    const question = await databaseService.questions.findOneAndUpdate(
      { _id: new ObjectId(questionId) },
      {
        $set: {
          ...body,
          quiz_id: new ObjectId(body.quiz_id)
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
    const question = await databaseService.questions.findOne({ _id: new ObjectId(questionId) });
    return {
      question
    };
  }
}

const questionsService = new QuestionsService();
export default questionsService;
