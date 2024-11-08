import { Controller, Get, Query } from '@nestjs/common';
import { PaginationDto } from './common/dto/pagination.dto';

@Controller()
export class AppController {
  @Get()
  async getHello(@Query() filter: PaginationDto) {
    return filter;
  }
}
