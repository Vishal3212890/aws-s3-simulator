import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { BucketService } from 'src/bucket/bucket.service';
import { ObjectEntity } from './entities/object.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ObjectService {
  private uploadPath: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly bucketService: BucketService,
    @InjectRepository(ObjectEntity)
    private readonly objectRepository: Repository<ObjectEntity>,
  ) {
    this.uploadPath = configService.getOrThrow<string>('UPLOAD_PATH');
  }

  async putObject(bucketName: string, key: string, file: Express.Multer.File) {
    const bucket = await this.bucketService.getBucket(bucketName);
    if (!bucket) {
      throw new NotFoundException(`"${bucketName}" bucket does not exist`);
    }

    let object = await this.objectRepository.findOne({
      where: { bucket: { id: bucket.id }, key },
    });

    if (!object) object = new ObjectEntity();

    object.key = key;
    object.size = file.size;
    object.mimetype = file.mimetype;
    object.bucket = bucket;

    await this.objectRepository.save(object);

    const objectPath = path.join(this.uploadPath, bucket.name, key);
    await fs.writeFile(objectPath, file.buffer);

    return object;
  }

  async getObjects(bucketName: string) {
    const bucket = await this.bucketService.getBucket(bucketName);
    if (!bucket) {
      throw new NotFoundException(`"${bucketName}" bucket does not exist`);
    }

    const objects = await this.objectRepository.find({
      where: { bucket: { id: bucket.id } },
    });

    return objects;
  }

  async getObject(bucketName: string, key: string) {
    const bucket = await this.bucketService.getBucket(bucketName);
    if (!bucket) {
      throw new NotFoundException(`"${bucketName}" bucket does not exist`);
    }

    const object = await this.objectRepository.findOne({
      where: {
        bucket: { id: bucket.id },
        key,
      },
    });

    if (!object) {
      throw new NotFoundException(
        `"${bucket.name}/${key}" object does not exist`,
      );
    }

    return { path: path.join(this.uploadPath, bucket.name, key), data: object };
  }

  async deleteObject(bucketName: string, key: string) {
    const bucket = await this.bucketService.getBucket(bucketName);
    if (!bucket) {
      throw new NotFoundException(`"${bucketName}" bucket does not exist`);
    }

    const object = await this.objectRepository.findOne({
      where: {
        bucket: { id: bucket.id },
        key,
      },
    });

    if (!object) {
      throw new NotFoundException(
        `"${bucket.name}/${key}" object does not exist`,
      );
    }

    await this.objectRepository.delete({
      bucket: { id: bucket.id },
      key,
    });

    await fs.unlink(path.join(this.uploadPath, bucket.name, key));

    return object;
  }
}
