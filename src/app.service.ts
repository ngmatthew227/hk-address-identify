import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  parse(body: { address: [] | string }): any {
    console.log(body);
  }
}
