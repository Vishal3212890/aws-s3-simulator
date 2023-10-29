import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ObjectService } from './object.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PutObjectDto } from './dto/put-object.dto';
import { createReadStream } from 'fs';
import { Response } from 'express';

@Controller('buckets/:bucket/objects')
export class ObjectController {
  constructor(private readonly objectService: ObjectService) {}

  @Put('/')
  @UseInterceptors(FileInterceptor('file'))
  async putObject(
    @Param('bucket') bucket: string,
    @Body() { key }: PutObjectDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('File is required');
    const object = await this.objectService.putObject(bucket, key, file);
    return { message: 'Object Uploaded', object };
  }

  @Get('/')
  async getObjects(@Param('bucket') bucket: string) {
    const objects = await this.objectService.getObjects(bucket);
    return objects;
  }

  @Get('/:key')
  async getObject(
    @Param('bucket') bucket: string,
    @Param('key') key: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { path, data } = await this.objectService.getObject(bucket, key);

    res.set({
      'Content-Type': data.mimetype,
    });

    return new StreamableFile(createReadStream(path));
  }

  @Delete('/:key')
  async deleteObject(
    @Param('bucket') bucket: string,
    @Param('key') key: string,
  ) {
    const object = await this.objectService.deleteObject(bucket, key);
    return { message: 'Object deleted', object };
  }
}
