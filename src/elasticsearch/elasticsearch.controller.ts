import { Controller, Get, Query } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';

@Controller('search')
export class ElasticsearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Get('user')
  async searchUser(@Query('username') username: string) {
    const users = await this.elasticsearchService.searchUser(username);
    return users;
  }
}
