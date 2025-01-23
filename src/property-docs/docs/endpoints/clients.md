---
sidebar_position: 3
---

# Clients

### Retrieve Client by ID

---

#### Method: **GET**

##### Path:
`/clients/{id}`

##### Parameters:
| Name  | Type     | Required | Description                     |
|-------|----------|----------|---------------------------------|
| `id`  | integer  | Yes      | Unique identifier of the client |

---

#### Request Example:
```http
GET /clients/1 HTTP/2.0
Host: localhost:8989
```

---
#### **Responses:**

#### **200 OK**
Client data has been successfully retrieved.

**Example Response:**
```json
{
  "id": 1,
  "name": "Antoinette Gutmann",
  "email": "Christy41@gmail.com",
  "phone": "+13807451189",
  "address": "78800 Shad Club",
  "_links": {
    "self": {
      "href": "http://localhost:8989/clients/1"
    }
  }
}
```

#### **404 Not Found**
The specified client ID does not exist.

**Example Response:**
```json
{
  "error": "Client not found"
}
```

#### **500 Internal Server Error**
Error reading clients file

**Example Response:**
```json
{
  "error": "Error reading data file"
}
```

```json
{
  "error": "Error parsing clients data"
}
```

---

### Retrieve Client's List

---

#### Method: **GET**

##### Path:
`/clients`

##### Parameters:

**None**

---

#### Request Example:
```http
GET /clients HTTP/2.0
Host: localhost:8989
```

---
#### **Responses:**

#### **200 OK**
Client data

**Example Response:**
```json
{
  "clientsList": [
    {
      "id": 1,
      "name": "Antoinette Gutmann",
      "email": "Christy41@gmail.com",
      "phone": "+13807451189",
      "address": "78800 Shad Club",
      "_links": {
        "self": {
          "href": "http://localhost:8989/clients/1"
        }
      }
    },
    {
      "id": 2,
      "name": "Karen Kerluke",
      "email": "Connor.Gusikowski@gmail.com",
      "phone": "+13518848050",
      "address": "1152 Dakota Groves",
      "_links": {
        "self": {
          "href": "http://localhost:8989/clients/2"
        }
      }
    }
  ]
}
```

#### **404 Not Found**
Empty client list

**Example Response:**
```json
{
  "error": "Empty client list"
}
```

#### **500 Internal Server Error**
Error reading clients file

**Example Response:**
```json
{
  "error": "Error reading data file"
}
```

```json
{
  "error": "Error parsing clients data"
}
```

---

### Create New Client

---

#### Method: **POST**

##### Path:
`/clients`

##### Request Body:
| Name      | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| `name`    | string | Yes      | Client's full name    |
| `email`   | string | Yes      | Valid email address   |
| `phone`   | string | Yes      | Valid phone number    |
| `address` | string | Yes      | Client's address      |

---

#### Request Example:
```http
GET /clients/1 HTTP/2.0
Host: localhost:8989
```

---
#### **Responses:**

#### **201 Created**
Client has been successfully created.

**Example Response:**
```json
{
  "message": "Client created successfully",
  "client": {
    "id": 3,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+48123456789",
    "address": "123 Main St"
  },
  "_links": {
    "self": {
      "href": "http://localhost:8989/clients"
    },
    "list": {
      "href": "http://localhost:8989/clients"
    }
  }
}
```
#### **400 Bad Request**
Invalid input

**Example Responses:**
```json
{
  "error": "All fields are required"
}
```

```json
{
  "error": "Invalid email address"
}
```

```json
{
  "error": "Invalid phone number"
}
```

#### **500 Internal Server Error**
Error saving client

**Example Response**
```json
{
  "error": "Error saving client"
}
```

```json
{
  "error": "Error reading clients data"
}

```json
{
  "error": "Error parsing clients data"
}
```

---

### Update Client Email

---

#### Method: **PATCH**

##### Path:
`/clients/{id}`

##### Parameters:
| Name  | Type    | Required | Description                     |
|-------|---------|----------|---------------------------------|
| `id`  | integer | Yes      | Unique identifier of the client |

##### Request Body:
| Name    | Type   | Required | Description         |
|---------|--------|----------|---------------------|
| `email` | string | Yes      | New email address   |

---

#### Request Example:
```http
PATCH /clients/1 HTTP/2.0
Host: localhost:8989
Content-Type: application/json
```

```json
{
    "email": "newemail@example.com"
}
```

**Responses:**

#### **200 OK**
Client email has been successfully updated.

**Example Response**
```json
{
  "message": "Client email updated successfully",
  "client": {
    "id": 1,
    "name": "John Doe",
    "email": "newemail@example.com",
    "phone": "+48123456789",
    "address": "123 Main St"
  },
  "_links": {
    "self": {
      "href": "http://localhost:8989/clients/1"
    }
  }
}
```

#### **400 Bad Request**
Invalid email format provided.

**Example Response**
```json
{
  "error": "Invalid email address"
}
```

#### **404 Not Found**
The specified client ID does not exist.

**Example Response**
```json
{
  "error": "Client not found"
}
```

#### **500 Internal Server Error**
Error reading clients file

**Example Response**
```json
{
  "error": "Error reading data file"
}
```

```json
{
  "error": "Error parsing clients data"
}
```

```json
{
  "error": "Error reading clients data"
}
```

---

### Update Client

---

#### Method: **PUT**

##### Path:
`/clients/{id}`

##### Parameters:
| Name  | Type    | Required | Description                     |
|-------|---------|----------|---------------------------------|
| `id`  | integer | Yes      | Unique identifier of the client |

##### Request Body:
| Name      | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| `name`    | string | Yes      | Client's full name    |
| `email`   | string | Yes      | Valid email address   |
| `phone`   | string | Yes      | Valid phone number    |
| `address` | string | Yes      | Client's address      |

---

#### Request Example:
```http
PUT /clients/1 HTTP/2.0
Host: localhost:8989
Content-Type: application/json
```

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+48123456789",
  "address": "123 Main St"
}
```

**Responses:**

#### **200 OK**
Client has been successfully updated.

**Example Response**
```json
{
  "message": "Client updated successfully",
  "client": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+48123456789",
    "address": "123 Main St"
  },
  "_links": {
    "self": {
      "href": "http://localhost:8989/clients/1"
    }
  }
}
```

#### **400 Bad Request**
Invalid input data provided.

**Example Response**
```json
{
  "error": "Invalid name"
}
```

```json
{
  "error": "All fields are required"
}
```

```json
{
  "error": "Invalid email address"
}
```

```json
{
  "error": "Invalid phone number"
}
```

#### **404 Not Found**
The specified client ID does not exist.

**Example Response**
```json
{
  "error": "Client not found"
}
```

#### **500 Internal Server Error**
Error reading clients file

**Example Response**
```json
{
  "error": "Error reading clients data"
}
```

```json
{
  "error": "Error updating client data"
}

```json
{
  "error": "Error parsing clients data"
}
```

---

### Delete Client

---

#### Method: **DELETE**

##### Path:
`/clients/{id}`

##### Parameters:
| Name  | Type    | Required | Description                     |
|-------|---------|----------|---------------------------------|
| `id`  | integer | Yes      | Unique identifier of the client |

---

#### Request Example:
```http
DELETE /clients/1 HTTP/2.0
Host: localhost:8989
```

**Responses:**

#### **200 OK**
Client has been successfully deleted.

**Example Response**
```json
{
  "message": "Client deleted successfully",
  "_links": {
    "self": {
      "href": "http://localhost:8989/clients/1"
    },
    "list": {
      "href": "http://localhost:8989/clients"
    }
  }
}
```

#### **404 Not Found**
The specified client ID does not exist.

**Example Response**
```json
{
  "error": "Client not found"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

**Example Response**
```json
{
  "error": "Error reading clients data"
}
```

```json
{
  "error": "Error deleting client"
}
```

---