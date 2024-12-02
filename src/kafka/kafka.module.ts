import { Module } from '@nestjs/common';
import { KafkaConsumerService } from './kafka-consumer.service';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaController } from './kafka.controller';

@Module({
  controllers: [KafkaController],
  providers: [KafkaProducerService, KafkaConsumerService],
  exports: [KafkaProducerService], // Để các module khác có thể sử dụng Producer
})
export class KafkaModule {}
