import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'], // Kafka broker URL
  });

  private readonly producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect(); // Kết nối với Kafka khi module khởi động
    console.log('Kafka Producer đã kết nối');
  }

  async onModuleDestroy() {
    await this.producer.disconnect(); // Ngắt kết nối khi module bị hủy
  }

  async sendMessage(topic: string, message: string) {
    await this.producer.send({
      topic, // Topic muốn gửi tin nhắn
      messages: [{ value: message }],
    });
    console.log(`Gửi tin nhắn đến ${topic}: ${message}`);
  }
}
