import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import { ObjectId } from 'mongodb';

import { PaginationReqQuery } from '~/models/requests/Common.requests';
import { CreateTopicReqBody, UpdateTopicReqBody } from '~/models/requests/Topic.request';
import Topic from '~/models/schemas/Topic.schema';
import databaseService from './database.services';

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

  // Lấy danh sách chủ đề
  async getTopics(query: PaginationReqQuery) {
    const { page, limit } = query;
    const _page = Number(page) || 1;
    const _limit = Number(limit) || 20;
    const [topics, total] = await Promise.all([
      databaseService.topics
        .find({})
        .skip((_page - 1) * _limit)
        .limit(_limit)
        .toArray(),
      databaseService.topics.countDocuments({})
    ]);
    return {
      topics,
      page: _page,
      limit: _limit,
      total_rows: total,
      total_pages: Math.ceil(total / _limit)
    };
  }

  // Cập nhật chủ đề
  async updateTopic({ topic_id, body }: { topic_id: string; body: UpdateTopicReqBody }) {
    const { name, description } = body;
    const updateValues = omitBy(
      {
        name,
        description
      },
      isUndefined
    );
    const topic = await databaseService.topics.findOneAndUpdate(
      {
        _id: new ObjectId(topic_id)
      },
      {
        $set: updateValues,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    );
    return topic;
  }

  // Xóa chủ đề
  async deleteTopics(topic_ids: string[]) {
    const { deletedCount } = await databaseService.topics.deleteMany({
      _id: {
        $in: topic_ids.map((topic_id) => new ObjectId(topic_id))
      }
    });
    return {
      deletedCount
    };
  }
}

const topicsService = new TopicsService();
export default topicsService;
