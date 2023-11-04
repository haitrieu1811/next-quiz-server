import { Router } from 'express';
import { uploadImageController } from '~/controllers/images.controllers';
import { wrapRequestHandler } from '~/utils/handler';

const imagesRouter = Router();

imagesRouter.post('/upload', wrapRequestHandler(uploadImageController));

export default imagesRouter;
