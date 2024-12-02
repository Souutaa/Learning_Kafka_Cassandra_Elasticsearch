import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'], // Kafka broker URL
  });

  private readonly consumer = this.kafka.consumer({ groupId: 'my-group' });

  async onModuleInit() {
    await this.consumer.connect(); // Kết nối với Kafka khi module khởi động
    await this.consumer.subscribe({
      topics: ['my-topic', 'user-created'],
      fromBeginning: true,
    });

    console.log('Kafka Consumer đã kết nối và lắng nghe topic my-topic');

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(`Nhận tin nhắn từ ${topic}:`, {
          partition,
          offset: message.offset,
          value: message.value.toString(),
        });
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect(); // Ngắt kết nối khi module bị hủy
  }
}
