import { CreateTopicReqBody } from '~/models/requests/Topic.request';
import databaseService from './database.services';
import Topic from '~/models/schemas/Topic.schema';

class TopicsService {
  // Tạo chủ đề
  async createTopic(body: CreateTopicReqBody) {
    const { name, description } = body;
    const { insertedId } = await databaseService.topics.insertOne(
      new Topic({
        name,
        description
      })
    );
    const topic = await databaseService.topics.findOne({
      _id: insertedId
    });
    return topic;
  }
}

const topicsService = new TopicsService();
export default topicsService;
