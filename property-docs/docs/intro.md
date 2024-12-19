---
sidebar_position: 0
---

# Property API Documentation

## Overview
Property API is a RESTful service providing comprehensive property management capabilities, including client management, property listings, and reservation handling.

## Base Configuration
- **Base URL**: `http://localhost:8989`
- **SwaggerUI**: `http://localhost:8989/api-docs`

## Available Resources
- **Clients** - User management endpoints
- **Properties** - Property listing management
- **Reservations** - Booking and reservation system

## Security & Headers
All responses include the following security headers:

```http
Content-Type: application/json
X-Content-Type-Options: nosniff
Cache-Control: no-cache
Content-Security-Policy: script-src 'self' 'unsafe-eval'
```

## CORS Configuration
Cross-Origin Resource Sharing is configured with:

- Origin: http://localhost:8989
- Methods: GET, POST, PUT, DELETE, PATCH
- Allowed Headers: Content-Type, X-Content-Type-Options, Cache-Control
- Credentials: Enabled

## API Documentation
Interactive API documentation is available through Swagger UI at /api-docs endpoint. It provides detailed information about all available endpoints, request/response schemas, and testing capabilities.