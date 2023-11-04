import { Request } from 'express';
import path from 'path';
import sharp from 'sharp';
import { UPLOAD_IMAGE_DIR } from '~/constants/dir';

import { getNameFromFullname, handleUploadImage } from '~/utils/file';

class ImagesService {
  // Upload ảnh (một hoặc nhiều ảnh)
  async uploadImage(req: Request) {
    const images = await handleUploadImage(req);
    const result = await Promise.all(
      images.map(async (image) => {
        const newName = getNameFromFullname(image.newFilename);
        const newFullname = `${newName}.jpg`;
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullname);
        await sharp(image.filepath).jpeg().toFile(newPath);
        return {
          name: newFullname
        };
      })
    );
    return result;
  }
}

const imagesService = new ImagesService();
export default imagesService;
