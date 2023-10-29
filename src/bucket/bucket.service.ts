import { ConflictException, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import { Bucket } from './entities/bucket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BucketService {
  private uploadPath: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Bucket)
    private readonly bucketRepository: Repository<Bucket>,
  ) {
    this.uploadPath = configService.getOrThrow<string>('UPLOAD_PATH');
  }

  async createBucket(name: string) {
    const bucketExists = await this.bucketRepository.findOne({
      where: { name },
    });
    if (bucketExists) {
      throw new ConflictException(`"${name}" bucket already exists`);
    }

    const bucket = new Bucket();
    bucket.name = name;

    await this.bucketRepository.save(bucket);
    await fs.mkdir(path.join(this.uploadPath, name));

    return bucket;
  }

  getBuckets() {
    return this.bucketRepository.find();
  }

  getBucket(name: string) {
    return this.bucketRepository.findOne({ where: { name } });
  }
}
