import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }

  @Post('/api/parse')
  parse(@Body() body: { address: string[] }): Promise<string> {
    return this.appService.parseAddress(body.address);
  }
}
