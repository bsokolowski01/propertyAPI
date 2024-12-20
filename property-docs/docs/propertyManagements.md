---
sidebar_position: 1
---

# Property Management

Property is a core entity in our API that represents real estate objects such as houses, apartments, or land. Each property contains detailed information about the real estate object including its physical characteristics, status, and pricing.

## Property Structure

A property object contains the following fields:

| Field         | Type   | Description                                           | Required |
|---------------|--------|-------------------------------------------------------|----------|
| id            | number | Unique identifier of the property                      | Auto-generated |
| address       | string | Physical address of the property                       | Yes |
| description   | string | Detailed description of the property                   | Yes |
| rooms         | number | Number of rooms in the property                        | Yes |
| surfaceArea   | string | Total area of the property (in m²)                    | Yes |
| status        | enum   | Current status of the property                        | Yes |
| type          | enum   | Type of the property                                  | Yes |
| price         | string | Sale price of the property (in PLN)                   | Only for sale |
| rent          | string | Monthly rental price (in PLN)                         | Only for rent |
| pricePerMeter | string | Price per square meter (calculated automatically)     | Auto-calculated |

## Property Status Types

The following status types are available:
- `for sale` - Property is available for purchase
- `sold` - Property has been sold
- `for rent` - Property is available for rent
- `rented` - Property is currently rented

## Property Types

Available property types:
- `house` - Single-family or multi-family house
- `apartment` - Apartment or flat
- `land` - Undeveloped land plot

## Validation Rules

- All required fields must be provided
- `rooms` must be greater than zero
- `surfaceArea` must be greater than zero
- `price` (if provided) must be greater than zero
- `rent` (if provided) must be greater than zero
- Either `price` or `rent` must be provided, but not both
- `status` must be one of the defined enum values
- `type` must be one of the defined enum values

## Example Request

```json
{
  "address": "ul. Przykładowa 123, Warszawa",
  "description": "Modern apartment in city center",
  "rooms": 3,
  "surfaceArea": 70,
  "status": "for sale",
  "type": "apartment",
  "price": 500000
}
```

**Example Response**
```json
{
  "message": "Property created successfully",
  "property": {
    "id": 1,
    "address": "ul. Przykładowa 123, Warszawa",
    "description": "Modern apartment in city center",
    "rooms": 3,
    "surfaceArea": "70 m2",
    "status": "for sale",
    "type": "apartment",
    "price": "500000 zł",
    "pricePerMeter": "7142.86 zł/m2"
  },
  "_links": {
    "self": {
      "href": "http://localhost:3000/properties/1"
    },
    "list": {
      "href": "http://localhost:3000/properties"
    }
  }
}
```