import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import { TOPICS_MESSAGES } from '~/constants/messages';
import { PaginationReqQuery } from '~/models/requests/Common.requests';
import {
  CreateTopicReqBody,
  DeleteTopicsReqBody,
  UpdateTopicReqBody,
  UpdateTopicReqParams
} from '~/models/requests/Topic.request';
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

// Lấy danh sách chủ đề
export const getTopicsController = async (
  req: Request<ParamsDictionary, any, any, PaginationReqQuery>,
  res: Response
) => {
  const { topics, page, limit, total_rows, total_pages } = await topicsService.getTopics(req.query);
  return res.json({
    message: TOPICS_MESSAGES.GET_TOPICS_SUCCESSFULLY,
    data: {
      topics,
      pagination: {
        page,
        limit,
        total_rows,
        total_pages
      }
    }
  });
};

// Cập nhật chủ đề
export const updateTopicController = async (
  req: Request<UpdateTopicReqParams, any, UpdateTopicReqBody>,
  res: Response
) => {
  const { topic_id } = req.params;
  const { body } = req;
  const topic = await topicsService.updateTopic({
    topic_id,
    body
  });
  return res.json({
    message: TOPICS_MESSAGES.UPDATE_TOPIC_SUCCESSFULLY,
    data: {
      topic
    }
  });
};

// Xóa chủ đề
export const deleteTopicsController = async (
  req: Request<ParamsDictionary, any, DeleteTopicsReqBody>,
  res: Response
) => {
  const { topic_ids } = req.body;
  const { deletedCount } = await topicsService.deleteTopics(topic_ids);
  return res.json({
    message: `Xóa thành công ${deletedCount} topic`
  });
};
