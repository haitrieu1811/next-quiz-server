import express from 'express';

import { ENV_CONFIG } from './constants/config';
import { defaultErrorHandler } from './middlewares/error.middlewares';
import imagesRouter from './routes/images.routes';
import quizzesRouter from './routes/quizzes.routes';
import topicsRouter from './routes/topics.routes';
import usersRouter from './routes/users.routes';
import databaseService from './services/database.services';
import { initFolders } from './utils/file';

databaseService.connect().then(() => {
  databaseService.indexUsers();
  databaseService.indexRefreshTokens();
});

initFolders();

const app = express();
const port = ENV_CONFIG.PORT || 8000;

app.use(express.json());
app.use('/users', usersRouter);
app.use('/images', imagesRouter);
app.use('/topics', topicsRouter);
app.use('/quizzes', quizzesRouter);
app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
