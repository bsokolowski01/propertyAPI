"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var swagger_jsdoc_1 = require("swagger-jsdoc");
var swagger_ui_express_1 = require("swagger-ui-express");
var cors_1 = require("cors");
var generator_1 = require("./generator");
var clientByIdRoute_1 = require("./routes/client/clientByIdRoute");
// import { clientsRouter } from './routes/client/clientsRoute.js';
// import { clientIdRouterDEL } from './routes/client/clientByIdRouteDEL.js';
// import { clientRouterPATCH } from './routes/client/clientByIdRoutePATCH.js';
// import { clientByIdRouterPUT } from './routes/client/clientByIdRoutePUT.js';
// import { propertiesRouter } from './routes/property/propertiesRoute.js';
// import { propertyIdRouter } from './routes/property/propertyByIdRoute.js';
// import { propertyIdRouterDEL } from './routes/property/propertyByIdRouteDEL.js';
// import { propertyRouterPUT } from './routes/property/propertyRoutePUT.js';
// import { propertyRouterPOST } from './routes/property/propertyRoutePOST.js';
// import { propertyByIdRouterPATCH } from './routes/property/propertyByIdRoutePATCH.js';
// import { reservationsRouter } from './routes/reservation/reservationsRoute.js';
// import { reservationRouterPOST } from './routes/reservation/reservationRoutePOST.js';
// import { reservationByIdRouter } from './routes/reservation/reservationByIdRoute.js';
// import { reservationByIdRouterPATCH } from './routes/reservation/reservationByIdRoutePATCH.js';
// import { reservationByIdRouterDEL } from './routes/reservation/reservationByIdRouteDEL.js';
// import { reservationByIdRouterPUT } from './routes/reservation/reservationByIdRoutePUT.js';
var app = (0, express_1.default)();
//słowo klucz: rabarbar 24.10.2024
app.use(express_1.default.json());
var corsOptions = {
    origin: 'http://localhost:8989',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'X-Content-Type-Options', 'Cache-Control'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
var clientData = [];
var propertyData = [];
for (var id = 1; id <= 10; id++) {
    clientData.push((0, generator_1.clientGenerator)(id));
    propertyData.push((0, generator_1.propertyGenerator)(id));
}
fs_1.default.writeFileSync('./data/client.json', JSON.stringify(clientData, null, 2));
fs_1.default.writeFileSync('./data/property.json', JSON.stringify(propertyData, null, 2));
// Swagger setup
var swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Property API',
            version: '1.0.0',
            description: 'API for managing properties and reservations',
        },
        servers: [
            {
                url: 'http://localhost:8989',
            },
        ],
    },
    apis: ['routes/**/*.js', 'routes/**/*.ts'],
};
var swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Middleware to set headers for all responses
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});
// Use the routers
//app.use("", clientsRouter);
app.use("", clientByIdRoute_1.clientIdRouter);
// app.use("", clientRouterPOST);
// app.use("", clientIdRouterDEL); 
// app.use("", clientRouterPATCH);
// app.use("", clientByIdRouterPUT);
// app.use("", propertiesRouter);
// app.use("", propertyIdRouter);
// app.use("", propertyIdRouterDEL);
// app.use("", propertyRouterPUT);
// app.use("", propertyRouterPOST);
// app.use("", propertyByIdRouterPATCH);
// app.use("", reservationsRouter);
// app.use("", reservationRouterPOST);
// app.use("", reservationByIdRouter);
// app.use("", reservationByIdRouterPATCH);
// app.use("", reservationByIdRouterDEL);
// app.use("", reservationByIdRouterPUT);
app.listen(8989, function () {
    console.log('Started on 8989');
});
