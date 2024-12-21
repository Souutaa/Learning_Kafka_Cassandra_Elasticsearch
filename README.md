# Learning Kafka, Cassandra, Elasticsearch, Redis, and NestJS with CQRS & Microservices

## 🚀 Overview

This project demonstrates the integration of **Kafka**, **Cassandra**, **Elasticsearch**, **Redis**, and **NestJS** using the **CQRS (Command Query Responsibility Segregation)** pattern combined with a **Microservices architecture**. It focuses on building scalable, event-driven systems suitable for high-performance applications.

## 📚 Tech Stack

- **Kafka**: Event streaming platform for real-time data processing.
- **Cassandra**: Distributed NoSQL database for scalable data storage.
- **Elasticsearch**: Search and analytics engine.
- **Redis**: In-memory data store for caching and real-time data access.
- **NestJS**: Progressive Node.js framework for building efficient and scalable server-side applications.
- **CQRS Pattern**: Separates read and write operations to improve performance and scalability.
- **Microservices**: Decoupled services for better maintainability and scalability.

## 🛠️ Architecture

- **Command Service**: Handles write operations and business logic.
- **Query Service**: Handles read operations and optimized queries.
- **Kafka Broker**: Manages event streaming and message queues.
- **Cassandra Database**: Stores persistent data for commands.
- **Elasticsearch**: Provides powerful search capabilities.
- **Redis Cache**: Accelerates read operations with caching.

### Data Flow:

1. **Command Layer:** Receives incoming commands via REST APIs or gRPC.
2. **Kafka Event Bus:** Publishes events to specific topics.
3. **Cassandra Storage:** Stores structured data.
4. **Elasticsearch Indexing:** Indexes data for fast querying.
5. **Query Layer:** Serves read requests, leveraging Elasticsearch and Redis.

## 📂 Project Structure

```
src/
├── auth-service/      # Authentication microservice
├── user-service/      # User management microservice
├── order-service/     # Order management microservice
├── query-service/     # Query microservice
├── kafka/            # Kafka configuration
├── cassandra/        # Cassandra configuration
├── elasticsearch/    # Elasticsearch configuration
├── redis/            # Redis configuration
├── shared/           # Shared utilities and DTOs
└── main.ts           # Application entry point
```

## ⚙️ Setup & Installation

1. **Clone Repository:**

```bash
git clone https://github.com/your-repo/learning-kafka-cassandra-elasticsearch-redis-nestjs.git
cd learning-kafka-cassandra-elasticsearch-redis-nestjs
```

2. **Install Dependencies:**

```bash
npm install
```

3. **Environment Configuration:**
   Set up `.env` file with appropriate configurations for Kafka, Cassandra, Elasticsearch, and Redis.

4. **Run Services:**

```bash
docker-compose up
```

5. **Start Application:**

```bash
npm run start:dev
```

## ✅ Key Features

- Decoupled services with clear separation of concerns.
- Real-time data streaming with Kafka.
- Optimized search with Elasticsearch.
- Highly available storage with Cassandra.
- Low-latency caching with Redis.

## 🧪 Testing

Run tests using:

```bash
npm run test
```

## 📖 Learning Goals

- Implementing CQRS with NestJS.
- Integrating Kafka for event-driven communication.
- Managing data storage with Cassandra.
- Enhancing search with Elasticsearch.
- Optimizing performance with Redis.

## 🤝 Contribution

Feel free to contribute by creating pull requests or raising issues.

## 📜 License

This project is licensed under the MIT License.

## 🌟 Acknowledgments

- NestJS Documentation
- Apache Kafka Resources
- Cassandra & Elasticsearch Guides

---

Happy Learning! 🚀
