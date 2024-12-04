import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CassandraModule } from 'src/cassandra/cassandra.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import {
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
} from './handlers/commands';
import {
  FindUserByIdQueryHandler,
  FindUserByUsernameQueryHandler,
  GetAllUsersQueryHandler,
} from './handlers/queries';
import { UserController } from './user.controller';

@Module({
  imports: [KafkaModule, CassandraModule, CqrsModule],
  controllers: [UserController],
  providers: [
    CreateUserCommandHandler,
    UpdateUserCommandHandler,
    FindUserByIdQueryHandler,
    FindUserByUsernameQueryHandler,
    GetAllUsersQueryHandler,
  ],
})
export class UserModule {}
