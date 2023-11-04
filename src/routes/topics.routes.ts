import { Router } from 'express';

import { createTopicController } from '~/controllers/topics.controllers';
import { createTopicValidator } from '~/middlewares/topics.middlewares';
import { accessTokenValidator } from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handler';

const topicsRouter = Router();

// Tạo chủ đề
topicsRouter.post('/', accessTokenValidator, createTopicValidator, wrapRequestHandler(createTopicController));

export default topicsRouter;
