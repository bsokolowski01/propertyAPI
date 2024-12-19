# Reservations

### Retrieve Reservation by ID

---

#### Method: **GET**

##### Path:
`/reservations/{id}`

##### Parameters:
| Name  | Type    | Required | Description                            |
|-------|---------|----------|----------------------------------------|
| `id`  | integer | Yes      | Unique identifier of the reservation   |

---

#### Request Example:
```http
GET /reservations/1 HTTP/2.0
Host: localhost:8989
```

**Responses:**

#### **200 OK**
Reservation data has been successfully retrieved.

**Example Response:**
```json
{
  "id": 1,
  "propertyId": 1,
  "clientId": 1,
  "startDate": "2024-03-15",
  "endDate": "2024-03-20",
  "status": "active",
  "_links": {
    "self": {
      "href": "http://localhost:8989/reservations/1"
    },
    "list": {
      "href": "http://localhost:8989/reservations"
    }
  }
}
```
#### **404 Not Found**
The specified reservation ID does not exist.

**Example Response:**
```json
{
  "error": "Reservation not found"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

**Example Response:**
```json
{
  "error": "Error reading data file"
}
```

```json
{
  "error": "Error parsing reservations or reservations not found"
}
```

---

### List All Reservations

---

#### Method: **GET**

##### Path:
`/reservations`

##### Parameters:
None required

---

#### Request Example:
```http
GET /reservations HTTP/2.0
Host: localhost:8989
```

**Responses:**

#### **200 OK**
List of all reservations has been successfully retrieved.

**Example Response:**
```json
{
  "reservationsList": [
    {
      "id": 1,
      "propertyId": 6,
      "clientId": 3,
      "date": {
        "start": "2024-10-16T14:39:31.088Z",
        "end": "2024-10-21T14:39:31.088Z"
      },
      "_links": {
        "self": {
          "href": "http://localhost:8989/reservations/1"
        }
      }
    },
    {
      "id": 2,
      "propertyId": 8,
      "clientId": 5,
      "date": {
        "start": "2024-11-01T10:00:00.000Z",
        "end": "2024-11-07T10:00:00.000Z"
      },
      "_links": {
        "self": {
          "href": "http://localhost:8989/reservations/2"
        }
      }
    }
  ],
  "_links": {
    "self": {
      "href": "http://localhost:8989/reservations"
    }
  }
}
```

#### **404 Not Found**
No reservations found.

**Example Response:**
```json
{
  "error": "Empty reservation list"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

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

### Create New Reservation

---

#### Method: **POST**

##### Path:
`/reservations`

##### Request Body:
| Name        | Type    | Required | Description                     |
|-------------|---------|----------|---------------------------------|
| `propertyId`| integer | Yes      | ID of property to reserve      |
| `clientId`  | integer | Yes      | ID of client making reservation |
| `date.start` | string | No*     | Day from which the reservation starts ( ISO 8601 format )  |
| `date.end` | string | No**      | Day from which the reservation ends ( ISO 8601 format )  |

\* Date is set automatically \
** Date is set automatically 3 days after date.start

---

#### Request Example:
```http
POST /reservations HTTP/2.0
Host: localhost:8989
Content-Type: application/json
```

```json
{
    "propertyId": 1,
    "clientId": 1
}
```

**Responses:**
Reservation has been successfully created.

**Example Response:**
```json
{
  "message": "Reservation created successfully",
  "reservation": {
    "id": 1,
    "propertyId": 1,
    "clientId": 1,
    "date": {
      "start": "2024-03-15T12:00:00.000Z",
      "end": "2024-03-18T12:00:00.000Z"
    }
  },
  "_links": {
    "self": {
      "href": "http://localhost:8989/reservations"
    },
    "list": {
      "href": "http://localhost:8989/reservations"
    }
  }
}
```

#### **400 Bad Request**
Invalid input data provided.

**Example Response:**
```json
{
  "error": "Invalid input"
}
```

#### **400 Bad Request**
Invalid input data provided.

**Example Response:**
```json
{
  "error": "Property not found"
}
```

```json
{
  "error": "Client not found"
}
```

```json
{
  "error": "Reservation can only be made for properties with status \"for sale\" or \"for rent\""
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

**Example Response:**
```json
{
  "error": "Error reading properties data"
}
```

```json
{
  "error": "Error parsing properties data"
}
```

```json
{
  "error": "Error reading clients data"
}
```

```json
{
  "error": "Error parsing clients data"
}
```

```json
{
  "error": "Error reading reservations data"
}
```

```json
{
  "error": "Error parsing reservations data"
}
```

```json
{
  "error": "Error saving reservation"
}
```

---

### Extend Reservation

---

#### Method: **PATCH**

##### Path:
`/reservations/{id}`

##### Parameters:
| Name   | Type    | In    | Required | Description                           |
|--------|---------|-------|----------|---------------------------------------|
| `id`   | integer | path  | Yes      | Unique identifier of the reservation |
| `days` | integer | query | Yes      | Number of days to extend (> 0)       |

---

#### Request Example:
```http
PATCH /reservations/1?days=3 HTTP/2.0
Host: localhost:8989
```

**Responses:**

#### **200 OK**

**Example Response:**
```json
{
  "message": "Reservation extended successfully",
  "id": 1,
  "propertyId": 1,
  "clientId": 1,
  "date": {
    "start": "2024-03-15T12:00:00.000Z",
    "end": "2024-03-21T12:00:00.000Z"
  },
  "_links": {
    "self": {
      "href": "http://localhost:8989/reservations/1"
    },
    "list": {
      "href": "http://localhost:8989/reservations"
    }
  }
}
```

#### **400 Bad Request**
Invalid number of days provided.


```json
{
  "error": "Invalid number of days"
}
```

#### **404 Not Found**
The specified reservation ID does not exist.

**Example Response:**
```json
{
  "error": "Reservation not found"
}
```

#### **500 Internal Server Error**
```json
{
  "error": "Error reading data file"
}
```

```json
{
  "error": "Error parsing reservations or reservations not found"
}
```

```json
{
  "error": "Error updating reservation"
}
```

---

### Update Reservation

---

#### Method: **PUT**

##### Path:
`/reservations/{id}`

##### Parameters:
| Name  | Type    | In   | Required | Description                           |
|-------|---------|------|----------|---------------------------------------|
| `id`  | integer | path | Yes      | Unique identifier of the reservation |

##### Request Body:
| Name         | Type    | Required | Description                          |
|-------------|---------|----------|--------------------------------------|
| `propertyId`| integer | Yes      | ID of property to reserve           |
| `clientId`  | integer | Yes      | ID of client making reservation     |
| `date`      | object  | Yes      | Reservation dates                   |
| `date.start`| string  | Yes      | Start date (ISO 8601 format)       |
| `date.end`  | string  | Yes      | End date (ISO 8601 format)         |

---

#### Request Example:
```http
PUT /reservations/1 HTTP/2.0
Host: localhost:8989
Content-Type: application/json
```

```json
{
    "propertyId": 1,
    "clientId": 1,
    "date": {
        "start": "2024-03-15T12:00:00.000Z",
        "end": "2024-03-20T12:00:00.000Z"
    }
}
```

**Response:**

#### **200 OK**
Reservation has been successfully updated.

**Example Response:**
```json
{
  "message": "Reservation data updated successfully",
  "reservation": {
    "id": 1,
    "propertyId": 1,
    "clientId": 1,
    "date": {
      "start": "2024-03-15T12:00:00.000Z",
      "end": "2024-03-20T12:00:00.000Z"
    }
  },
  "_links": {
    "self": {
      "href": "http://localhost:8989/reservations/1"
    },
    "list": {
      "href": "http://localhost:8989/reservations"
    }
  }
}
```

#### **400 Bad Request**
Invalid input data provided.

**Example Response:**
```json
{
  "error": "Invalid propertyId"
}
```

```json
{
    "error": "Invalid clientId"
}
```

```json
{
  "error": "Invalid date"
}
```

```json
{
    "error": "Invalid date format"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

**Example Response:**
```json
{
  "error": "Error reading data file"
}
```

```json
{
  "error": "Error parsing reservations or reservations not found"
}
```

```json
{
  "error": "Error updating reservation"
}
```

---

### Delete Reservation

---

#### Method: **DELETE**

##### Path:
`/reservations/{id}`

##### Parameters:
| Name  | Type    | Required | Description                           |
|-------|---------|----------|---------------------------------------|
| `id`  | integer | Yes      | Unique identifier of the reservation |

---

#### Request Example:
```http
DELETE /reservations/1 HTTP/2.0
Host: localhost:8989
```

**Responses:**

#### **200 OK**
Reservation has been successfully deleted.

**Example Response:**
```json
{
  "message": "Reservation deleted successfully",
  "_links": {
    "self": {
      "href": "http://localhost:8989/reservations/1"
    },
    "list": {
      "href": "http://localhost:8989/reservations"
    }
  }
}
```

#### **404 Not Found**
The specified reservation ID does not exist.

**Example Response:**
```json
{
  "error": "Reservation not found"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

**Example Response:**
```json
{
  "error": "Error reading data file"
}
```

```json
{
  "error": "Error parsing reservations or reservations not found"
}
```

```json
{
  "error": "Error deleting reservation"
}
```

---