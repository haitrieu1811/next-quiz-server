import { ObjectId } from 'mongodb';
import { Answer } from '../schemas/Question.schema';

// Body: Tạo câu hỏi
export interface CreateQuestionReqBody {
  quiz_id: ObjectId;
  name: string;
  description?: string;
  images?: ObjectId[];
  answers: Answer[];
}
