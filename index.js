import express from 'express';
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { clientGenerator, propertyGenerator } from './generator.js';

import { clientIdRouter } from './routes/client/clientByIdRoute.js';
import { clientRouterPOST } from './routes/client/clientRoutePOST.js';
import { clientsRouter } from './routes/client/clientsRoute.js';
import { clientIdRouterDEL } from './routes/client/clientByIdRouteDEL.js';
import { clientRouterPATCH } from './routes/client/clientByIdRoutePATCH.js';
import { clientByIdRouterPUT } from './routes/client/clientByIdRoutePUT.js';

import { propertiesRouter } from './routes/property/propertiesRoute.js';
import { propertyIdRouter } from './routes/property/propertyByIdRoute.js';
import { propertyIdRouterDEL } from './routes/property/propertyByIdRouteDEL.js';
import { propertyRouterPUT } from './routes/property/propertyRoutePUT.js';
import { propertyRouterPOST } from './routes/property/propertyRoutePOST.js';
import { propertyByIdRouterPATCH } from './routes/property/propertyByIdRoutePATCH.js';

import { reservationsRouter } from './routes/reservation/reservationRoute.js';
import { reservationRouterPOST } from './routes/reservation/reservationRoutePOST.js';
import { reservationByIdRouter } from './routes/reservation/reservationByIdRoute.js';
import { reservationByIdRouterPATCH } from './routes/reservation/reservationByIdRoutePATCH.js';
import { reservationByIdRouterDEL } from './routes/reservation/reservationByIdRouteDEL.js';
import { reservationByIdRouterPUT } from './routes/reservation/reservationByIdRoutePUT.js';

const app = new express();

//słowo klucz: rabarbar 24.10.2024

app.use(express.json());

const clientData = []
const propertyData = []

for (let id = 1; id <=10; id++) {
    clientData.push(clientGenerator(id));
    propertyData.push(propertyGenerator(id));
}

fs.writeFileSync('./data/client.json', JSON.stringify(clientData, null, 2));
fs.writeFileSync('./data/property.json', JSON.stringify(propertyData, null, 2));

// Swagger setup
const swaggerOptions = {
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
    apis: ['routes/**/*.js'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// wersjonowanie API i link np. api/v1/..

app.use("", clientsRouter);
app.use("", clientIdRouter);
app.use("", clientRouterPOST);
app.use("", clientIdRouterDEL); 
app.use("", clientRouterPATCH);
app.use("", clientByIdRouterPUT);

app.use("", propertiesRouter);
app.use("", propertyIdRouter)
app.use("", propertyIdRouterDEL);
app.use("", propertyRouterPUT);
app.use("", propertyRouterPOST);
app.use("", propertyByIdRouterPATCH);

app.use("", reservationsRouter);
app.use("", reservationRouterPOST);
app.use("", reservationByIdRouter);
app.use("", reservationByIdRouterPATCH);
app.use("", reservationByIdRouterDEL);
app.use("", reservationByIdRouterPUT);


app.listen(8989, () => {
    console.log('Started on 8989');
}); 