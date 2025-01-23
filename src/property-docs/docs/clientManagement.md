---
sidebar_position: 2
---

# Client Management

Client is a core entity in our API that represents users who can rent or buy properties. Each client contains detailed information about the user including their personal details and contact information.

## Client Structure

A client object contains the following fields:

| Field         | Type   | Description                                           | Required |
|---------------|--------|-------------------------------------------------------|----------|
| id            | number | Unique identifier of the client                        | Auto-generated |
| firstName     | string | First name of the client                              | Yes |
| lastName      | string | Last name of the client                               | Yes |
| email         | string | Email address of the client                           | Yes |
| phoneNumber   | string | Contact phone number                                  | Yes |
| status        | enum   | Current status of the client                         | Yes |
| type          | enum   | Type of the client                                   | Yes |

## Client Status Types

The following status types are available:
- `active` - Client is actively using the service
- `inactive` - Client account is temporarily disabled
- `blocked` - Client account has been blocked
- `deleted` - Client account has been marked for deletion

## Client Types

Available client types:
- `individual` - Individual client
- `company` - Business client
- `agent` - Real estate agent
- `investor` - Property investor

## Validation Rules

- All required fields must be provided
- `email` must be a valid email address
- `phoneNumber` must be a valid phone number format
- `firstName` and `lastName` must not be empty
- `status` must be one of the defined enum values
- `type` must be one of the defined enum values

## Example Request

```json
{
  "firstName": "Jan",
  "lastName": "Kowalski",
  "email": "jan.kowalski@example.com",
  "phoneNumber": "+48 123 456 789",
  "status": "active",
  "type": "individual"
}
```

**Example Response**
```json
{
  "message": "Client created successfully",
  "client": {
    "id": 1,
    "firstName": "Jan",
    "lastName": "Kowalski",
    "email": "jan.kowalski@example.com",
    "phoneNumber": "+48 123 456 789",
    "status": "active",
    "type": "individual",
    "createdAt": "2024-01-20T10:00:00.000Z"
  },
  "_links": {
    "self": {
      "href": "http://localhost:3000/clients/1"
    },
    "list": {
      "href": "http://localhost:3000/clients"
    }
  }
}
```