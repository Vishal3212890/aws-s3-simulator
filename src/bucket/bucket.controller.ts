import { Body, Controller, Get, Post } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { CreateBucketDto } from './dto/create-bucket.dto';

@Controller('buckets')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Post('/')
  async createBucket(@Body() { name }: CreateBucketDto) {
    const bucket = await this.bucketService.createBucket(name);
    return { message: 'Bucket Created', bucket };
  }

  @Get('/')
  async getBuckets() {
    const buckets = await this.bucketService.getBuckets();
    return buckets;
  }
}
