import { Collection, Db, MongoClient } from 'mongodb';

import { ENV_CONFIG } from '~/constants/config';
import Image from '~/models/schemas/Image.schema';
import Question from '~/models/schemas/Question.schema';
import Quiz from '~/models/schemas/Quiz.schema';
import RefreshToken from '~/models/schemas/RefreshToken.schema';
import Topic from '~/models/schemas/Topic.schema';
import User from '~/models/schemas/User.schema';

const uri = `mongodb+srv://${ENV_CONFIG.DB_USERNAME}:${ENV_CONFIG.DB_PASSWORD}@next-quiz-cluster.c7ptrko.mongodb.net/?retryWrites=true&w=majority`;

class DatabaseService {
  private client: MongoClient;
  private db: Db;

  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(ENV_CONFIG.DB_NAME);
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 });
      console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async indexUsers() {
    const isExisted = await this.users.indexExists(['email_1', 'phone_number_1']);
    if (!isExisted) {
      await Promise.all([
        this.users.createIndex({ email: 1 }, { unique: true }),
        this.users.createIndex({ phone_number: 1 })
      ]);
    }
  }

  async indexRefreshTokens() {
    const isExisted = await this.refresh_tokens.indexExists(['token_1', 'exp_1']);
    if (!isExisted) {
      await Promise.all([
        this.refresh_tokens.createIndex({ token: 1 }, { unique: true }),
        this.refresh_tokens.createIndex({ exp: 1 }, { expireAfterSeconds: 0 })
      ]);
    }
  }

  async indexQuizzes() {
    const isExisted = await this.quizzes.indexExists(['name_1']);
    if (!isExisted) {
      await Promise.all([this.quizzes.createIndex({ name: 1 }, { unique: true })]);
    }
  }

  get users(): Collection<User> {
    return this.db.collection(ENV_CONFIG.DB_USERS_COLLECTION);
  }

  get refresh_tokens(): Collection<RefreshToken> {
    return this.db.collection(ENV_CONFIG.DB_REFRESH_TOKENS_COLLECTION);
  }

  get topics(): Collection<Topic> {
    return this.db.collection(ENV_CONFIG.DB_TOPICS_COLLECTION);
  }

  get images(): Collection<Image> {
    return this.db.collection(ENV_CONFIG.DB_IMAGES_COLLECTION);
  }

  get quizzes(): Collection<Quiz> {
    return this.db.collection(ENV_CONFIG.DB_QUIZZES_COLLECTION);
  }

  get questions(): Collection<Question> {
    return this.db.collection(ENV_CONFIG.DB_QUESTIONS_COLLECTION);
  }
}

const databaseService = new DatabaseService();
export default databaseService;
