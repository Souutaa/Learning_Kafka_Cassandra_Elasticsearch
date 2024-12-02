import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { KafkaModule } from 'src/kafka/kafka.module';
import { CassandraModule } from 'src/cassandra/cassandra.module';

@Module({
  imports: [KafkaModule, CassandraModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
