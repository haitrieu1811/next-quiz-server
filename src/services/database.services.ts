import { Collection, Db, MongoClient } from 'mongodb';

import { ENV_CONFIG } from '~/constants/config';
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

  get users(): Collection<User> {
    return this.db.collection(ENV_CONFIG.DB_USERS_COLLECTION);
  }

  get refresh_tokens(): Collection<RefreshToken> {
    return this.db.collection(ENV_CONFIG.DB_REFRESH_TOKENS_COLLECTION);
  }

  get topics(): Collection<Topic> {
    return this.db.collection(ENV_CONFIG.DB_REFRESH_TOPICS_COLLECTION);
  }
}

const databaseService = new DatabaseService();
export default databaseService;
