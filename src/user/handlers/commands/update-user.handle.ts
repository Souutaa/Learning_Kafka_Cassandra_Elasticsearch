import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { UpdateUserCommand } from 'src/user/commands/update-user.command';
import { User } from 'src/user/entities/user.entity';
import { FindUserByIdQuery } from 'src/user/queries/find-user-by-id.query';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    private readonly queryBus: QueryBus, // Dùng QueryBus để gọi FindUserByIdQuery
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly cassandraService: CassandraService,
  ) {}
  async execute(command: UpdateUserCommand): Promise<User> {
    const { id, updateUserDto } = command;
    const foundUser: User = await this.queryBus.execute(
      new FindUserByIdQuery(id),
    );
    if (!foundUser) {
      throw new Error('User not found');
    }
    const updateUser = {
      id,
      email: updateUserDto.email ? updateUserDto.email : foundUser.email,
      username: updateUserDto.username
        ? updateUserDto.username
        : foundUser.username,
    };

    // Lưu người dùng đã cập nhật vào Cassandra
    await this.cassandraService.updateUser(
      id,
      updateUser.email,
      updateUser.username,
    );

    await this.kafkaProducerService.sendMessage(
      'user-updated',
      JSON.stringify(updateUser),
    );
    return updateUser;
  }
}
