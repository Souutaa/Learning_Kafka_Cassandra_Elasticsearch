// handlers/find-user-by-id.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from '../../queries/find-user-by-id.query';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { User } from 'src/user/entities/user.entity';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdQueryHandler
  implements IQueryHandler<FindUserByIdQuery>
{
  constructor(
    private readonly cassandraService: CassandraService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<User> {
    const { id } = query;
    const user = await this.cassandraService.getUserById(id);
    if (!user) {
      return null;
    }
    const result: User = {
      id: user.get('id'),
      username: user.get('username'),
      email: user.get('email'),
    };

    await this.kafkaProducerService.sendMessage(
      'user-getById',
      `Get user by id = ${id} success`,
    );

    return result;
  }
}
