import { Router } from 'express';

import {
  createTopicController,
  deleteTopicsController,
  getTopicsController,
  updateTopicController
} from '~/controllers/topics.controllers';
import { paginationValidator } from '~/middlewares/common.middlewares';
import {
  createTopicValidator,
  deleteTopicsValidator,
  topicIdValidator,
  updateTopicValidator
} from '~/middlewares/topics.middlewares';
import { accessTokenValidator, adminRoleValidator } from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handler';

const topicsRouter = Router();

// Tạo chủ đề
topicsRouter.post(
  '/',
  accessTokenValidator,
  adminRoleValidator,
  createTopicValidator,
  wrapRequestHandler(createTopicController)
);

// Lấy danh sách chủ đề
topicsRouter.get('/', paginationValidator, wrapRequestHandler(getTopicsController));

// Cập nhật chủ đề
topicsRouter.patch(
  '/:topic_id',
  accessTokenValidator,
  adminRoleValidator,
  topicIdValidator,
  updateTopicValidator,
  wrapRequestHandler(updateTopicController)
);

// Xóa chủ đề (một hoặc nhiều)
topicsRouter.delete(
  '/',
  accessTokenValidator,
  adminRoleValidator,
  deleteTopicsValidator,
  wrapRequestHandler(deleteTopicsController)
);

export default topicsRouter;
