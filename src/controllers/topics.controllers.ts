import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { TOPICS_MESSAGES } from '~/constants/messages';
import { CreateTopicReqBody } from '~/models/requests/Topic.request';
import topicsService from '~/services/topics.services';

// Tạo chủ đề
export const createTopicController = async (req: Request<ParamsDictionary, any, CreateTopicReqBody>, res: Response) => {
  const topic = await topicsService.createTopic(req.body);
  return res.json({
    message: TOPICS_MESSAGES.CREATE_TOPIC_SUCCESSFULLY,
    data: {
      topic
    }
  });
};
