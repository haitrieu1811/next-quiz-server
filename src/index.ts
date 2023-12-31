import express from 'express';
import cors from 'cors';

import { ENV_CONFIG } from './constants/config';
import { defaultErrorHandler } from './middlewares/error.middlewares';
import imagesRouter from './routes/images.routes';
import quizzesRouter from './routes/quizzes.routes';
import topicsRouter from './routes/topics.routes';
import usersRouter from './routes/users.routes';
import databaseService from './services/database.services';
import { initFolders } from './utils/file';
import questionsRouter from './routes/questions.routes';

databaseService.connect().then(() => {
  databaseService.indexUsers();
  databaseService.indexRefreshTokens();
});

initFolders();

const app = express();
const port = ENV_CONFIG.PORT || 8000;
const corsOptions = {
  origin: ENV_CONFIG.CLIENT_URL
};

app.use(express.json());
app.use(cors(corsOptions));
app.use('/users', usersRouter);
app.use('/images', imagesRouter);
app.use('/topics', topicsRouter);
app.use('/quizzes', quizzesRouter);
app.use('/questions', questionsRouter);
app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
