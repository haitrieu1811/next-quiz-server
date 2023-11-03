import { MongoClient, ServerApiVersion, Db } from 'mongodb'
import { ENV_CONFIG } from '~/constants/config'

const uri = `mongodb+srv://${ENV_CONFIG.DB_USERNAME}:${ENV_CONFIG.DB_PASSWORD}@next-quiz-cluster.c7ptrko.mongodb.net/?retryWrites=true&w=majority`

class DatabaseServices {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(ENV_CONFIG.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}

const databaseServices = new DatabaseServices()
export default databaseServices
