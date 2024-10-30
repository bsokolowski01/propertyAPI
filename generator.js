"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyGenerator = exports.clientGenerator = void 0;
var faker_1 = require("@faker-js/faker");
var clientGenerator = function (id) {
    faker_1.faker.seed(id);
    return {
        id: id,
        name: faker_1.faker.person.fullName(),
        email: faker_1.faker.internet.email(),
        phone: faker_1.faker.phone.number(),
        address: faker_1.faker.location.streetAddress(),
    };
};
exports.clientGenerator = clientGenerator;
var propertyGenerator = function (id) {
    faker_1.faker.seed(id);
    var rooms = faker_1.faker.number.int({ min: 1, max: 5 });
    var surfaceArea = rooms <= 2
        ? faker_1.faker.number.int({ min: 20, max: 50 })
        : faker_1.faker.number.int({ min: 50, max: 100 });
    var price = surfaceArea < 50
        ? faker_1.faker.number.int({ multipleOf: 100, min: 200000, max: 500000 })
        : faker_1.faker.number.int({ multipleOf: 100, min: 600000, max: 1000000 });
    var status = faker_1.faker.helpers.arrayElement(['for sale', 'for rent', 'sold', 'rented']);
    var property = {
        id: id,
        address: faker_1.faker.location.streetAddress(),
        description: faker_1.faker.lorem.sentence(),
        rooms: rooms,
        surfaceArea: "".concat(surfaceArea, " m2"),
        status: status,
        type: faker_1.faker.helpers.arrayElement(['apartment', 'house', 'land']),
    };
    if (status === 'for rent' || status === 'rented') {
        property.rent = "".concat(faker_1.faker.number.int({ multipleOf: 100, min: 2000, max: 4500 }), " z\u0142");
    }
    else {
        property.price = "".concat(price, " z\u0142");
        property.pricePerMeter = "".concat((price / surfaceArea).toFixed(2), " z\u0142/m2");
    }
    return property;
};
exports.propertyGenerator = propertyGenerator;
