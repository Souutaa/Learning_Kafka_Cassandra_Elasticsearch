// handlers/find-user-by-id.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { User } from 'src/user/entities/user.entity';
import { FindUserByUsernameQuery } from 'src/user/queries/find-user-by-username.query';

@QueryHandler(FindUserByUsernameQuery)
export class FindUserByUsernameQueryHandler
  implements IQueryHandler<FindUserByUsernameQuery>
{
  constructor(
    private readonly cassandraService: CassandraService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async execute(query: FindUserByUsernameQuery): Promise<User> {
    const { username } = query;
    const user = await this.cassandraService.getUserByUsername(username);
    if (!user) {
      return null;
    }
    const result: User = {
      id: user.get('id'),
      username: user.get('username'),
      email: user.get('email'),
    };

    await this.kafkaProducerService.sendMessage(
      'user-getByName',
      `Get user by name= ${username} success`,
    );

    return result;
  }
}
