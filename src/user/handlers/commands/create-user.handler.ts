// handlers/create-user.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../../commands/create-user.command';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { User } from 'src/user/entities/user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly cassandraService: CassandraService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const newUser = {
      id: Date.now().toString(), // Giả lập ID người dùng
      username: command.createUserDto.username,
      email: command.createUserDto.email,
    };

    await this.cassandraService.insertUser(
      newUser.id,
      newUser.username,
      newUser.email,
    );
    await this.kafkaProducerService.sendMessage(
      'user-created',
      JSON.stringify(newUser),
    );

    return newUser;
  }
}
