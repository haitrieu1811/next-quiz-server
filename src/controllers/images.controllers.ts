import { Request, Response } from 'express';
import { IMAGES_MESSAGES } from '~/constants/messages';

import imagesService from '~/services/images.services';

// Upload ảnh (một hoặc nhiều ảnh)
export const uploadImageController = async (req: Request, res: Response) => {
  const images = await imagesService.uploadImage(req);
  return res.json({
    message: IMAGES_MESSAGES.UPLOAD_IMAGE_SUCCESSFULLY,
    data: {
      images
    }
  });
};
