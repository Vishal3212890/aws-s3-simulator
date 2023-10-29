import { Module } from '@nestjs/common';
import { BucketService } from './bucket.service';
import { BucketController } from './bucket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket } from './entities/bucket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bucket])],
  controllers: [BucketController],
  providers: [BucketService],
  exports: [BucketService],
})
export class BucketModule {}
