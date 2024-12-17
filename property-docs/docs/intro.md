# PropertyAPI Documentation

## Introduction

**PropertyAPI** is a RESTful API that enables efficient management of properties, clients, and reservations.  
The API supports CRUD operations on all resources.

### Base URL
```
localhost:8989
```

## Resources & Endpoints

### 3.1 Clients

#### List All Clients

**Method:** GET  
**Endpoint:** `/clients`  

**Request Example:**
```http
GET /clients HTTP/1.1
Host: localhost:8989
```

**Response Example:**
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "email": "john.doe@example.com"
  },
  {
    "id": "2",
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
  }
]
```

#### Get Client by ID

**Method:** GET  
**Endpoint:** `/clients/{id}`  

**Description:** Retrieves details of a specific client.

---

#### Create a New Client

**Method:** POST  
**Endpoint:** `/clients`  

**Body Parameters:**
| Field      | Type    | Required | Description             |
|------------|---------|----------|-------------------------|
| `name`     | string  | Yes      | Full name of the client |
| `email`    | string  | Yes      | Client's email address  |
| `phone`    | string  | Yes      | Client's phone number  |
| `address`    | string  | Yes      | Client's address  |

**Request Example:**
```http
POST /clients HTTP/1.1
Host: localhost:8989
```

```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com"
  "phone": "+13807451189",
  "address": "78800 Shad Club"
}
```

**Response Example:**
```json
{
  "id": "11",
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+13807451189",
  "address": "78800 Shad Club"
}
```

---

### 3.2 Properties

#### List All Properties

**Method:** GET  
**Endpoint:** `/properties`  

**Description:** Retrieves a list of all available properties.

**Response Example:**
```json
[
  {
    "id": "1",
    "name": "Seaside Apartment",
    "location": "Gdańsk, Poland",
    "price": 450000,
    "status": "available"
  },
  {
    "id": "2",
    "name": "Mountain Cabin",
    "location": "Zakopane, Poland",
    "price": 300000,
    "status": "sold"
  }
]
```

---

### 3.3 Reservations

#### List All Reservations

**Method:** GET  
**Endpoint:** `/reservations`  

**Description:** Retrieve all reservations.

---

## Error Handling

| Status Code | Description                       |
|-------------|-----------------------------------|
| `400`       | Bad Request – Validation failed   |
| `404`       | Not Found – Resource does not exist |
| `500`       | Internal Server Error             |

**Example Error Response:**
```json
{
  "error": "Resource not found",
  "status": 404
}
```

---

## Examples

### Using curl to Fetch All Properties:

```bash
curl -X GET "https://api.example.com/v1/properties" \
-H "Authorization: Bearer <your_token>"
```

### JavaScript Example (Axios):
```javascript
const axios = require('axios');

axios.get('https://api.example.com/v1/properties', {
  headers: { Authorization: 'Bearer your_token' }
})
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

---

## FAQs

- **How to handle pagination?**  
  Use query parameters `?page=` and `?limit=` to paginate responses.  

- **How to filter results?**  
  Apply query parameters like `?status=available` or `?location=Gdańsk`.

---

