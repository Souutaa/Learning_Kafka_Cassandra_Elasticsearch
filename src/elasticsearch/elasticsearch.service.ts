import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService as NestElasticSearch } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly elasticsearchService: NestElasticSearch;

  constructor() {
    this.elasticsearchService = new NestElasticSearch({
      node: 'http://localhost:9200', // Elasticsearch node URL
    });
  }
  async onModuleInit() {
    try {
      // Kiểm tra kết nối Elasticsearch
      const pingResult = await this.elasticsearchService.ping();
      console.log('Elasticsearch connection successful:', pingResult);
    } catch (error) {
      console.error('Elasticsearch connection failed:', error);
    }
  }

  async searchUser(query: string) {
    const result = await this.elasticsearchService.search({
      index: 'users', // Tên index bạn muốn tìm kiếm
      body: {
        query: {
          match: { username: query },
        },
      },
    });

    return result.hits.hits; // Trả về kết quả tìm kiếm
  }
}
