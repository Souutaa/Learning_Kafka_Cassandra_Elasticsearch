import { Injectable } from '@nestjs/common';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CassandraService } from 'src/cassandra/cassandra.service';

@Injectable()
export class UserService {
  constructor(
    private readonly cassandraService: CassandraService, // Tiêm CassandraService
    private readonly kafkaProducerService: KafkaProducerService, // Tiêm KafkaProducerService nếu bạn vẫn muốn sử dụng Kafka
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = {
      id: Date.now().toString(), // Giả lập ID người dùng
      username: createUserDto.username,
      email: createUserDto.email,
    };
    // Lưu người dùng vào Cassandra
    await this.cassandraService.insertUser(newUser.username, newUser.email);

    // Gửi thông điệp đến Kafka topic 'user-created' (nếu cần)
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
