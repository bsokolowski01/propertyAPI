import { faker } from '@faker-js/faker';

export const generatorData = (id) => {
    faker.seed(id)
    return {
        client: 
        {
            id: id,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            address: faker.location.streetAddress(),
        },

        property:
        {
            id: id,
            address: faker.location.streetAddress(),
            description: faker.lorem.sentence(),
            price: faker.finance.amount(),
            rooms: faker.number.int({ min: 1, max: 5 }),
            status: faker.helpers.arrayElement(['for_sale', 'sold', 'rented']),
            type: faker.helpers.arrayElement(['apartment', 'house', 'land']),
        },

        reservation: 
        {
            id: id,
            rooms: faker.number.int({ min: 1, max: 10 }),
            date: 
                {
                    start: faker.date.recent(),
                    end: faker.date.soon(2),
                },
            status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
        } 
        
    }
}


