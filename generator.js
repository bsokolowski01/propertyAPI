import { faker } from '@faker-js/faker';

export const clientGenerator = (id) => {
    faker.seed(id)
    return {
    
            id: id,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
    }
}

export const propertyGenerator = (id) => {
    faker.seed(id)

    const rooms = faker.number.int({ min: 1, max: 5 });
    const surfaceArea = rooms <= 2 
        ? faker.number.int({ min: 20, max: 50 }) 
        : faker.number.int({ min: 50, max: 100 });
    const price = `${faker.number.int({ min: 100000, max: 1000000 })}zł`;
    
    return {
        id: id,
        address: faker.location.streetAddress(),
        description: faker.lorem.sentence(),
        price,
        rooms,
        surfaceArea, 
        pricePerMeter: `${(price / surfaceArea).toFixed(2)} zł/m2`,
        status: faker.helpers.arrayElement(['for sale','for rent', 'sold', 'rented']),
        type: faker.helpers.arrayElement(['apartment', 'house', 'land']),
    }
}

export const clientIdGenerator = () => {
    return {
        clientId: faker.number.int({ min: 1, max: 10 }),
    }
}