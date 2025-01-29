# Property API

Multi-protocol API service for property management system implemented with REST, GraphQL, and gRPC.

## Requirements

- Node.js (v16 or higher)
- npm (v8 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/bsokolowski01/propertyAPI.git
cd propertyAPI
```

2. Install dependencies
```bash
npm install
```

3. Generate initail data:
```bash
npm start
```

## Available Scripts
- Start REST API server 
```bash
npm run startRestApi
```
- Start GraphQL server
```bash
npm run startGraphQL 
```
- Start gRPC server
```bash
npm run startGrpcServer
```
- Run gRPC client
```bash
npm run startGrpcClient 
```

- Start documentation server
```bash
npm run startDocs
```

- Start all services concurrently (REST, GraphQL, gRPC)
```bash
npm run dev
```

## Project Structure
```
propertyAPI/
├── src/
│   ├── restAPI/       # REST API implementation
│   ├── graphQL/       # GraphQL server
│   ├── grpc/          # gRPC server and client
│   └── property-docs/ # API documentation
├── interfaces/        # TypeScript interfaces
├── tools/             # Data generation tools
└── data/              # JSON data storage
```


## API Documentation

After starting the servers, you can access:
- REST API Swagger documentation at: http://localhost:8989/api-docs
- GraphQL Playground at: http://localhost:9090/graphql
- API Documentation at: http://localhost:3000