import { Router } from 'express';

import { deleteImageController, uploadImageController } from '~/controllers/images.controllers';
import { imageIdValidator } from '~/middlewares/images.middlewares';
import { wrapRequestHandler } from '~/utils/handler';

const imagesRouter = Router();

// Upload ảnh (một hoặc nhiều ảnh)
imagesRouter.post('/upload', wrapRequestHandler(uploadImageController));

// Xóa ảnh
imagesRouter.delete('/:image_id', imageIdValidator, wrapRequestHandler(deleteImageController));

export default imagesRouter;
