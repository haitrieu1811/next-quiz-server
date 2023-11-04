import express from 'express';

import { ENV_CONFIG } from './constants/config';
import { defaultErrorHandler } from './middlewares/error.middlewares';
import usersRouter from './routes/users.routes';
import databaseService from './services/database.services';
import imagesRouter from './routes/images.routes';
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
app.use(defaultErrorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
