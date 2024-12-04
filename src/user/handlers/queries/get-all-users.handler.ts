// handlers/find-user-by-id.handler.ts
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CassandraService } from 'src/cassandra/cassandra.service';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { User } from 'src/user/entities/user.entity';
import { GetAllUsersQuery } from 'src/user/queries/get-all-users.query';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersQueryHandler
  implements IQueryHandler<GetAllUsersQuery>
{
  constructor(
    private readonly cassandraService: CassandraService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async execute(): Promise<User[]> {
    const users = await this.cassandraService.getAllUsers();
    if (!users) {
      return null;
    }
    const result: User[] = users.map((row) => ({
      id: row.get('id'),
      username: row.get('username'),
      email: row.get('email'),
    }));

    await this.kafkaProducerService.sendMessage(
      'user-getAll',
      'Get all user success',
    );

    return result;
  }
}
