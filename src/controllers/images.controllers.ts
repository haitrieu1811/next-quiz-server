import { Request, Response } from 'express';

import { IMAGES_MESSAGES } from '~/constants/messages';
import { imageIdReqParams } from '~/models/requests/Image.requests';
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

// Xóa ảnh
export const deleteImageController = async (req: Request<imageIdReqParams>, res: Response) => {
  const { image_id } = req.params;
  await imagesService.deleteImage(image_id);
  return res.json({
    message: IMAGES_MESSAGES.DELETE_IMAGE_SUCCESSFULLY
  });
};
