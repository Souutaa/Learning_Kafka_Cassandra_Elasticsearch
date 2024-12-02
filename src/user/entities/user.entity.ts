export class User {
  id: string; // ID của người dùng
  username: string; // Tên người dùng
  email: string; // Email người dùng

  // Khởi tạo thông tin người dùng
  constructor(id: string, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }
}
