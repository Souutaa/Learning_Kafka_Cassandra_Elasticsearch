import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [KafkaModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
