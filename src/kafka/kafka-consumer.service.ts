import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService as NestElasticSearch } from '@nestjs/elasticsearch';
import { Kafka } from 'kafkajs';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'], // Kafka broker URL
    retry: {
      initialRetryTime: 300, // 300ms
      retries: 10, // Thử lại 10 lần
    },
  });

  private readonly elasticsearchService: NestElasticSearch;
  private readonly consumer = this.kafka.consumer({ groupId: 'my-group' });

  listTopics = [
    'my-topic',
    'user-created',
    'user-updated',
    'user-getAll',
    'user-getByName',
    'user-getById',
  ];
  eachTopic = this.listTopics.join(' - ');

  constructor() {
    this.elasticsearchService = new NestElasticSearch({
      node: 'http://localhost:9200', // Elasticsearch node URL
    });
  }

  async onModuleInit() {
    await this.consumer.connect(); // Kết nối với Kafka khi module khởi động
    await this.consumer.subscribe({
      topics: this.listTopics,
      fromBeginning: true,
    });

    console.log(
      `Kafka Consumer đã kết nối và lắng nghe topic ${this.eachTopic}`,
    );
    // const bulkMessages: any[] = [];
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          console.log(`Nhận tin nhắn từ ${topic}:`, {
            partition,
            offset: message.offset,
            value: message.value.toString(),
          });
          console.log('-------------------------');

          if (topic == 'user-created' || topic == 'user-updated') {
            const user: User = JSON.parse(message.value.toString());

            if (!user.id || !user.email || !user.username) {
              console.warn(`Dữ liệu người dùng không hợp lệ:`, user);
              return;
            }

            await this.elasticsearchService.index({
              index: 'users',
              id: user.id,
              body: user,
            });
          }
        } catch (error) {
          console.error(`Lỗi khi xử lý tin nhắn từ ${topic}:`, error);
          console.error(`Giá trị tin nhắn thô:`, message.value.toString());
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect(); // Ngắt kết nối khi module bị hủy
  }
}
