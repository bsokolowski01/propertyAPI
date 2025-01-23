import { faker } from '@faker-js/faker';
import fs, {} from 'fs/promises'
import { Client } from 'interfaces/clientInterface';
import { Property, PropertyStatus, PropertyType } from 'interfaces/propertyInterface';
import { Reservation } from 'interfaces/reservationInterface';

const clientGenerator = (id: number): Client => {
    faker.seed(id);
    return {
        id: id,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: 'international' }),
        address: faker.location.streetAddress(),
    };
};

const propertyGenerator = (id: number): Property => {
    faker.seed(id);

    const rooms = faker.number.int({ min: 1, max: 5 });
    const surfaceArea = rooms <= 2
        ? faker.number.int({ min: 20, max: 50 })
        : faker.number.int({ min: 50, max: 100 });
    const price = surfaceArea < 50
        ? faker.number.int({ multipleOf: 100, min: 200000, max: 500000 })
        : faker.number.int({ multipleOf: 100, min: 600000, max: 1000000 });
    const status: PropertyStatus = faker.helpers.arrayElement([
        PropertyStatus.FOR_SALE,
        PropertyStatus.FOR_RENT,
        PropertyStatus.SOLD,
        PropertyStatus.RENTED
    ]);
    const type: PropertyType = faker.helpers.arrayElement([
        PropertyType.APARTMENT,
        PropertyType.HOUSE,
        PropertyType.LAND
    ]);

    const property: Property = {
        id: id,
        address: faker.location.streetAddress(),
        description: faker.lorem.sentence(),
        rooms,
        surfaceArea: `${surfaceArea} m2`,
        status,
        type
    };

    if (status === 'for rent' || status === 'rented') {
        property.rent = `${faker.number.int({ multipleOf: 100, min: 2000, max: 4500 })} zł`;
    } else {
        property.price = `${price} zł`;
        property.pricePerMeter = `${(price / surfaceArea).toFixed(0)} zł/m2`;
    }

    return property;
};

const reservationGenerator = (id: number): Reservation => {
    faker.seed(id);
    
    const startDate: Date = faker.date.between({ from: '2024-01-01', to: '2025-01-01' });
    const endDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);

    const reservation: Reservation = {
        id: id,
        propertyId: faker.number.int({ min: 1, max: 10 }),
        clientId: faker.number.int({ min: 1, max: 10 }),
        date: {
            start: startDate,
            end: endDate
        }
    };

    return reservation;
};

const checkAndCreateFolder = async (folderPath: string) => {
    try {
        await fs.mkdir(folderPath, { recursive: true });
    } catch (error) {
        console.error(`Error creating folder ${folderPath}:`, error);
    }
};

const checkAndCreateFile = async (filePath: string) => {
    try {
        await fs.access(filePath);
    } catch (error) {
        await fs.writeFile(filePath, JSON.stringify([]));
    }
};

const generateData = async () => {

    await checkAndCreateFolder('./data');

    await Promise.all([
        checkAndCreateFile('./data/client.json'),
        checkAndCreateFile('./data/property.json'),
        checkAndCreateFile('./data/reservation.json')
    ]);

    const clientData: Client[] = Array.from({ length: 10 }, (_, id) => clientGenerator(id + 1));
    const propertyData: Property[] = Array.from({ length: 10 }, (_, id) => propertyGenerator(id + 1));
    const reservationData: Reservation[] = Array.from({ length: 10 }, (_, id) => reservationGenerator(id + 1));

    await Promise.all([
        fs.writeFile('./data/client.json', JSON.stringify(clientData, null, 2)),
        fs.writeFile('./data/property.json', JSON.stringify(propertyData, null, 2)),
        fs.writeFile('./data/reservation.json', JSON.stringify(reservationData, null, 2))
    ]);
};

generateData().catch(console.error);