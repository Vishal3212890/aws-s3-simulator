import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  appName() {
    return 'AWS S3 Simulator';
  }
}
