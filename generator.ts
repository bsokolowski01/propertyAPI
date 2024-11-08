import { faker } from '@faker-js/faker';

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

interface Property {
    id: number;
    address: string;
    description: string;
    rooms: number;
    surfaceArea: string;
    status: string;
    type: string;
    rent?: string;
    price?: string;
    pricePerMeter?: string;
}

export const clientGenerator = (id: number): Client => {
    faker.seed(id);
    return {
        id: id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
    };
};

export const propertyGenerator = (id: number): Property => {
    faker.seed(id);

    const rooms = faker.number.int({ min: 1, max: 5 });
    const surfaceArea = rooms <= 2 
        ? faker.number.int({ min: 20, max: 50 }) 
        : faker.number.int({ min: 50, max: 100 });
    const price = surfaceArea < 50 
        ? faker.number.int({ multipleOf: 100, min: 200000, max: 500000 }) 
        : faker.number.int({ multipleOf: 100, min: 600000, max: 1000000 });
    const status = faker.helpers.arrayElement(['for sale', 'for rent', 'sold', 'rented']);
    
    const property: Property = {
        id: id,
        address: faker.location.streetAddress(),
        description: faker.lorem.sentence(),
        rooms,
        surfaceArea: `${surfaceArea} m2`,
        status,
        type: faker.helpers.arrayElement(['apartment', 'house', 'land']),
    };

    if (status === 'for rent' || status === 'rented') {
        property.rent = `${faker.number.int({multipleOf: 100, min: 2000, max: 4500})} zł`;
    } else {
        property.price = `${price} zł`;
        property.pricePerMeter = `${(price / surfaceArea).toFixed(2)} zł/m2`;
    }

    return property;
};