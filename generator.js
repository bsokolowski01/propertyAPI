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
        price: faker.finance.amount(),
        rooms: faker.number.int({ min: 1, max: 5 }),
        status: faker.helpers.arrayElement(['for_sale', 'sold', 'rented']),
        type: faker.helpers.arrayElement(['apartment', 'house', 'land']),
    }
}

export const reservationGenerator = (id) => {
    faker.seed(id)
    return {
        id: id,
        rooms: faker.number.int({ min: 1, max: 10 }),
        date: 
        {
            start: new Date().toISOString(),
            end: faker.date.soon({ days: 3, refDate: Date.now() }),
        },
        status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
    }
}

