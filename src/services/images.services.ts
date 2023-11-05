import { Request } from 'express';
import fsPromise from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { UPLOAD_IMAGE_DIR } from '~/constants/dir';

import { getExtensionFromFullname, getNameFromFullname, handleUploadImage } from '~/utils/file';
import { uploadFileToS3 } from '~/utils/s3';

class ImagesService {
  // Upload ảnh (một hoặc nhiều ảnh)
  async uploadImage(req: Request) {
    const images = await handleUploadImage(req);
    const result = await Promise.all(
      images.map(async (image) => {
        const newName = getNameFromFullname(image.newFilename);
        const extention = getExtensionFromFullname(image.newFilename);
        const newFullname = `${newName}.jpg`;
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullname);
        if (extention !== 'jpg') await sharp(image.filepath).jpeg().toFile(newPath);
        await uploadFileToS3({
          filename: `images/${newFullname}`,
          filepath: newPath,
          contentType: 'image/jpeg'
        });
        try {
          await Promise.all([fsPromise.unlink(image.filepath), fsPromise.unlink(newPath)]);
        } catch (error) {
          console.log(error);
        }
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
