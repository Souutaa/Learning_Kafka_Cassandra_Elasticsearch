import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'cassandra-driver';

@Injectable()
export class CassandraService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Client;

  constructor() {
    // Cấu hình kết nối Cassandra
    this.client = new Client({
      contactPoints: ['localhost'], // Địa chỉ của Cassandra node (có thể là 'localhost' trong môi trường phát triển)
      localDataCenter: 'datacenter1', // Tên datacenter trong Cassandra
      keyspace: 'user_db', // Keyspace của Cassandra bạn muốn kết nối tới
    });
  }

  async onModuleInit() {
    await this.client.connect();
    console.log('Cassandra đã kết nối thành công');
  }

  // Ngắt kết nối khi module bị hủy
  async onModuleDestroy() {
    await this.client.shutdown();
    console.log('Cassandra đã ngắt kết nối');
  }

  async insertUser(id: string, username: string, email: string) {
    const query = 'INSERT INTO users (id, username, email) VALUES (?, ?, ?)';
    await this.client.execute(query, [id, username, email], { prepare: true });
    console.log(`Người dùng ${username} đã được thêm vào cơ sở dữ liệu`);
  }

  async getAllUsers() {
    const query = 'SELECT * FROM users';
    const result = await this.client.execute(query);
    return result.rows;
  }

  async getUserByUsername(username: string) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const result = await this.client.execute(query, [username], {
      prepare: true,
    });
    return result.rows[0];
  }
}
