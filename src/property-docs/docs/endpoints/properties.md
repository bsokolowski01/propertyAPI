# Properties

### Retrieve Property by ID

---

#### Method: **GET**

##### Path:
`/properties/{id}`

##### Parameters:
| Name  | Type    | Required | Description                       |
|-------|---------|----------|-----------------------------------|
| `id`  | integer | Yes      | Unique identifier of the property |

---

#### Request Example:
```http
GET /properties/1 HTTP/2.0
Host: localhost:8989
```

**Responses:**

#### **200 OK**
Property data has been successfully retrieved.

**Example Response**
```json
{
  "id": 1,
  "address": "123 Main St",
  "description": "A beautiful house with a garden",
  "price": "500000 zł",
  "rooms": 3,
  "surfaceArea": 120,
  "pricePerMeter": "4166.67 zł/m2",
  "status": "for sale",
  "type": "house",
  "_links": {
    "self": {
      "href": "http://localhost:8989/properties/1"
    }
  }
}
```

#### **404 Not Found**
The specified property ID does not exist.

**Example Response**
```json
{
  "error": "Property not found"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

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
---

### List All Properties

---

#### Method: **GET**

##### Path:
`/properties`

##### Query Parameters:
| Name              | Type   | Required | Description               |
|-------------------|--------|----------|---------------------------|
| `maxPricePerMeter`| number | No       | Maximum price per meter  |
| `maxRent`         | number | No       | Maximum rent price       |

---

#### Request Examples:
```http
GET /properties HTTP/2.0
Host: localhost:8989
```

```http
GET /properties?maxPricePerMeter=5000&maxRent=2000 HTTP/2.0
Host: localhost:8989
```

**Responses**

#### **200 OK**
List of properties matching the criteria.

**Example Response**
```json
{
  "propertiesList": [
    {
      "id": 1,
      "address": "123 Main St",
      "description": "A beautiful house with a garden",
      "price": "500000 zł",
      "rooms": 3,
      "surfaceArea": 120,
      "pricePerMeter": "4166.67 zł/m2",
      "status": "for sale",
      "type": "house",
      "_links": {
        "self": {
          "href": "http://localhost:8989/properties/1"
        }
      }
    }
  ],
  "_links": {
    "self": {
      "href": "http://localhost:8989/properties"
    }
  }
}
```

#### **404 Not Found**
No properties match the specified criteria.

**Example Response**
```json
{
  "message": "No properties found matching the criteria"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

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

---

### Create New Property

---

#### Method: **POST**

##### Path:
`/properties`

##### Request Body:
| Name          | Type    | Required | Description                                    |
|---------------|---------|----------|------------------------------------------------|
| `address`     | string  | Yes      | Property address                              |
| `description` | string  | Yes      | Property description                          |
| `rooms`       | number  | Yes      | Number of rooms (> 0)                         |
| `surfaceArea` | number  | Yes      | Surface area in m² (> 0)                     |
| `status`      | string  | Yes      | Status: "for sale", "sold", "rented", "for rent" |
| `type`        | string  | Yes      | Type: "house", "apartment", "land"           |
| `price`       | number  | No*      | Property price (> 0)                         |
| `rent`        | string  | No*      | Monthly rent (> 0)                           |
| `pricePerMeter` | string | No**      | Price per meter is calculated by **price / surfaceArea** |

\* Either price or rent must be provided, but not both. \
** If a price is provided, the price per meter is calculated automatically

---

#### Request Example:
```http
POST /properties HTTP/2.0
Host: localhost:8989
Content-Type: application/json
```

```json
{
    "address": "123 Main St",
    "description": "A beautiful house with a garden",
    "rooms": 3,
    "surfaceArea": 120,
    "status": "for sale",
    "type": "house",
    "price": 500000,
}
```

**Responses**

#### **200 OK**
Property has been successfully created.

**Example Response:**
```json
{
  "message": "Property created successfully",
  "property": {
    "id": 1,
    "address": "123 Main St",
    "description": "A beautiful house with a garden",
    "rooms": 3,
    "surfaceArea": "120 m2",
    "status": "for sale",
    "type": "house",
    "price": "500000 zł",
    "pricePerMeter": "4166.67 zł/m2"
  },
  "_links": {
    "self": {
      "href": "http://localhost:8989/properties/1"
    },
    "list": {
      "href": "http://localhost:8989/properties"
    }
  }
}
```

#### **400 Bad Request**
Invalid input

**Example Responses:**
```json
{
  "error": "All fields are required and must be valid"
}
```

```json
{
  "error": "Rooms must be greater than zero"
}
```

```json
{
  "error": "Surface area must be greater than zero"
}
```

```json
{
  "error": "Invalid status value"
}
```

```json
{
  "error": "Either price or rent must be provided, but not both"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

**Example Responses:**
```json
{
  "error": "Error reading properties data"
}
```

```json
{
  "error": "Error saving property"
}
```

---

### Update Property Description

---

#### Method: **PATCH**

##### Path:
`/properties/{id}`

##### Parameters:
| Name  | Type    | Required | Description                       |
|-------|---------|----------|-----------------------------------|
| `id`  | integer | Yes      | Unique identifier of the property |

##### Request Body:
| Name          | Type   | Required | Description                    |
|---------------|--------|----------|--------------------------------|
| `description` | string | Yes      | New description of the property|

---

#### Request Example:
```http
PATCH /properties/1 HTTP/2.0
Host: localhost:8989
Content-Type: application/json
```

```json
{
    "description": "A newly renovated apartment with modern amenities"
}
```

**Responses:**

#### **200 OK**
Property description has been successfully updated.

**Example Response:**
```json
{
  "message": "Property description updated successfully",
  "_links": {
    "self": {
      "href": "http://localhost:8989/properties/1"
    },
    "list": {
      "href": "http://localhost:8989/properties"
    }
  }
}
```

#### **400 Bad Request**
Invalid input

**Example Response:**
```json
{
  "error": "Description is required"
}
```

```json
{
  "error": "Description is required"
}
```

#### **404 Not Found**
The specified property ID does not exist.

**Example Response:**
```json
{
  "error": "Property not found"
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

```json
{
  "error": "Error updating property description"
}
```

---

### Update Property

---

#### Method: **PUT**

##### Path:
`/properties/{id}`

##### Parameters:
| Name  | Type    | Required | Description                       |
|-------|---------|----------|-----------------------------------|
| `id`  | integer | Yes      | Unique identifier of the property |

##### Request Body:
| Name          | Type    | Required | Description                                    |
|---------------|---------|----------|------------------------------------------------|
| `address`     | string  | Yes      | Property address                              |
| `description` | string  | Yes      | Property description                          |
| `rooms`       | number  | Yes      | Number of rooms (> 0)                         |
| `surfaceArea` | number  | Yes      | Surface area in m² (> 0)                     |
| `status`      | string  | Yes      | Status: "for sale", "sold", "rented", "for rent" |
| `type`        | string  | Yes      | Type: "house", "apartment", "land"           |
| `price`       | number  | No*      | Property price (> 0)                         |
| `rent`        | string  | No*      | Monthly rent (> 0)                           |
| `pricePerMeter` | string | No**      | Price per meter is calculated by **price / surfaceArea** |

\* Either price or rent must be provided, but not both. \
** If a price is provided, the price per meter is calculated automatically

---

#### Request Example:
```http
PUT /properties/1 HTTP/2.0
Host: localhost:8989
Content-Type: application/json
```

```json
{
    "address": "123 Main St",
    "description": "A beautiful house with a garden",
    "rooms": 3,
    "surfaceArea": 120,
    "status": "for sale",
    "type": "house",
    "price": 500000
}
```

**Responses:**

#### **200 OK**
Property has been successfully updated.

**Example Response:**
```json
{
  "message": "Property updated successfully",
  "_links": {
    "self": {
      "href": "http://localhost:8989/properties/1"
    },
    "list": {
      "href": "http://localhost:8989/properties"
    }
  }
}
```

#### **400 Bad Request**
Invalid input data provided.

**Example Response:**
```json
{
  "error": "All fields are required and must be valid"
}
```

```json
{
  "error": "Rooms must be greater than zero"
}
```

```json
{
  "error": "Surface area must be greater than zero"
}
```

```json
{
  "error": "Price must be greater than zero"
}
```

```json
{
  "error": "Rent must be greater than zero"
}
```

```json
{
  "error": "Invalid status value"
}
```

```json
{
  "error": "Invalid type value"
}
```

#### **400 Bad Request**
The specified property ID does not exist.

**Example Response:**
```json
{
  "error": "Property not found"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

**Example Responses:**
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
  "error": "Error updating property"
}
```

---

### Delete Property

---

#### Method: **DELETE**

##### Path:
`/properties/{id}`

##### Parameters:
| Name  | Type    | Required | Description                       |
|-------|---------|----------|-----------------------------------|
| `id`  | integer | Yes      | Unique identifier of the property |

---

#### Request Example:
```http
DELETE /properties/1 HTTP/2.0
Host: localhost:8989
```

**Responses:**

#### **200 OK**
Property has been successfully deleted.

**Example Response:**
```json
{
  "message": "Property deleted successfully",
  "_links": {
    "self": {
      "href": "http://localhost:8989/properties/1"
    },
    "list": {
      "href": "http://localhost:8989/properties"
    }
  }
}
```

#### **200 OK**
Property has been successfully deleted.

**Example Response:**
```json
{
  "error": "Property not found"
}
```

#### **404 Not Found**
The specified property ID does not exist.

**Example Response:**
```json
{
  "error": "Property not found"
}
```

#### **500 Internal Server Error**
Server-side errors while processing the request.

**Example Responses:**
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
  "error": "Error deleting property"
}
```

---