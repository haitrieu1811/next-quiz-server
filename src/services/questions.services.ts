import { CreateQuestionReqBody } from '~/models/requests/Question.requests';
import databaseService from './database.services';
import Question from '~/models/schemas/Question.schema';

class QuestionsService {
  // Tạo câu hỏi
  async createQuestion(body: CreateQuestionReqBody) {
    const { insertedId } = await databaseService.questions.insertOne(new Question(body));
    const question = await databaseService.questions.findOne({ _id: insertedId });
    return {
      question
    };
  }
}

const questionsService = new QuestionsService();
export default questionsService;
