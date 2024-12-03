import { Injectable } from '@nestjs/common';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
    await this.cassandraService.insertUser(
      newUser.id,
      newUser.username,
      newUser.email,
    );

    // Gửi thông điệp đến Kafka topic 'user-created' (nếu cần)
    await this.kafkaProducerService.sendMessage(
      'user-created',
      JSON.stringify(newUser),
    );

    return newUser;
  }

  async findAll() {
    const userList = await this.cassandraService.getAllUsers();
    if (userList != null && userList.length > 0) {
      await this.kafkaProducerService.sendMessage(
        'user-getAll',
        'Get all user success',
      );

      return userList;
    }
    return [];
  }

  async findByUsername(username: string) {
    const user = await this.cassandraService.getUserByUsername(username);
    if (user) {
      await this.kafkaProducerService.sendMessage(
        'user-getByName',
        `Get user by name= ${username} success`,
      );
      return user;
    }
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
