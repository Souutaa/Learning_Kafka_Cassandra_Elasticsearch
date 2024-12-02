import { Body, Controller, Post } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';

@Controller('messages') // Định tuyến REST API tại '/messages'
export class KafkaController {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  @Post('/send')
  async sendMessage(@Body() body: { topic: string; message: string }) {
    const { topic, message } = body;
    await this.kafkaProducerService.sendMessage(topic, message);
    return {
      message: `Gửi tin nhắn "${message}" đến topic "${topic}" thành công.`,
    };
  }
}
