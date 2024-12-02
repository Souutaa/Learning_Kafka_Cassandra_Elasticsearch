import { Controller } from '@nestjs/common';
import { CassandraService } from './cassandra.service';

@Controller('cassandra')
export class CassandraController {
  constructor(private readonly cassandraService: CassandraService) {}
}
