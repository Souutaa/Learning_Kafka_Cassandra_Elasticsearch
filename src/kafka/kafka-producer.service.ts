import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Transaction } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'], // Kafka broker URL
    retry: {
      initialRetryTime: 300, // 300ms
      retries: 10, // Thử lại 10 lần
    },
  });

  private readonly producer: Producer = this.kafka.producer({
    transactionalId: 'my-transactional-producer', // ID duy nhất cho producer giao dịch
  });

  async onModuleInit() {
    await this.producer.connect(); // Kết nối với Kafka khi module khởi động
    console.log('Kafka Producer đã kết nối');
  }

  async onModuleDestroy() {
    await this.producer.disconnect(); // Ngắt kết nối khi module bị hủy
  }

  async sendMessage(topic: string, message: string) {
    const transaction: Transaction = await this.producer.transaction(); // Khởi tạo giao dịch
    try {
      await transaction.send({
        topic, // Topic muốn gửi tin nhắn
        messages: [{ value: message }],
      });
      console.log(`Gửi tin nhắn đến ${topic}: ${message}`);
      await transaction.commit();
      console.log('Giao dịch đã được commit.');
    } catch (error) {
      console.error(
        'Lỗi khi gửi tin nhắn trong giao dịch, abort giao dịch.',
        error,
      );
      // Hủy bỏ giao dịch nếu có lỗi xảy ra
      await transaction.abort();
    }
  }
}
