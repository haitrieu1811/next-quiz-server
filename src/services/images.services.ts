import { Request } from 'express';
import fsPromise from 'fs/promises';
import { ObjectId, WithId } from 'mongodb';
import path from 'path';
import sharp from 'sharp';

import { UPLOAD_IMAGE_DIR } from '~/constants/dir';
import Image from '~/models/schemas/Image.schema';
import { getExtensionFromFullname, getNameFromFullname, handleUploadImage } from '~/utils/file';
import { deleteFileFromS3, uploadFileToS3 } from '~/utils/s3';
import databaseService from './database.services';

class ImagesService {
  // Upload ảnh (một hoặc nhiều ảnh) -> sau khi upload xong, lưu vào database và trả về kết quả
  async uploadImage(req: Request) {
    const images = await handleUploadImage(req);
    const result = await Promise.all(
      images.map(async (image) => {
        const newName = getNameFromFullname(image.newFilename);
        const extention = getExtensionFromFullname(image.newFilename);
        const newFullname = `${newName}.jpg`;
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFullname);
        if (extention !== 'jpg') await sharp(image.filepath).jpeg().toFile(newPath);
        const [, { insertedId }] = await Promise.all([
          uploadFileToS3({
            filename: `images/${newFullname}`,
            filepath: newPath,
            contentType: 'image/jpeg'
          }),
          databaseService.images.insertOne(
            new Image({
              name: newFullname
            })
          )
        ]);
        const newImage = await databaseService.images.findOne({ _id: insertedId });
        try {
          await Promise.all([fsPromise.unlink(image.filepath), fsPromise.unlink(newPath)]);
        } catch (error) {
          console.log(error);
        }
        return newImage;
      })
    );
    return result;
  }

  // Xóa ảnh
  async deleteImage(id: string) {
    // Xóa ảnh trong database và trong S3 bucket
    const image = await databaseService.images.findOneAndDelete({ _id: new ObjectId(id) });
    await deleteFileFromS3(`images/${(image as WithId<Image>).name}`);
    return true;
  }
}

const imagesService = new ImagesService();
export default imagesService;
