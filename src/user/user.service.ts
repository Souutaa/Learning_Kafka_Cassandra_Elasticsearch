import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = {
      id: Date.now().toString(), // Giả lập ID người dùng
      username: createUserDto.username,
      email: createUserDto.email,
    };
    // Gửi thông điệp đến Kafka topic 'user-created'
    await this.kafkaProducerService.sendMessage(
      'user-created',
      JSON.stringify(newUser),
    );

    return newUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
