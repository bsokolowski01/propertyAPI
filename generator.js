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
    return {
        id: id,
        address: faker.location.streetAddress(),
        description: faker.lorem.sentence(),
        price: `${faker.finance.amount({ min: 100000, max: 1000000, dec: 0 })}zł`,
        rooms: faker.number.int({ min: 1, max: 5 }),
        status: faker.helpers.arrayElement(['for sale','for rent', 'sold', 'rented']),
        type: faker.helpers.arrayElement(['apartment', 'house', 'land']),
    }
}


