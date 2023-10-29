import { Module } from '@nestjs/common';
import { ObjectService } from './object.service';
import { ObjectController } from './object.controller';
import { BucketModule } from 'src/bucket/bucket.module';
import { ObjectEntity } from './entities/object.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ObjectEntity]), BucketModule],
  controllers: [ObjectController],
  providers: [ObjectService],
})
export class ObjectModule {}
