import express from 'express';
import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import { clientGenerator, propertyGenerator } from './generator';

import { clientIdRouter } from './routes/client/clientByIdRoute';
import { clientRouterPOST } from './routes/client/clientRoutePOST';
import { clientsRouter } from './routes/client/clientsRoute';
import { clientIdRouterDEL } from './routes/client/clientByIdRouteDEL';
import { clientRouterPATCH } from './routes/client/clientByIdRoutePATCH';
import { clientByIdRouterPUT } from './routes/client/clientByIdRoutePUT';

import { propertiesRouter } from './routes/property/propertiesRoute';
import { propertyIdRouter } from './routes/property/propertyByIdRoute';
import { propertyIdRouterDEL } from './routes/property/propertyByIdRouteDEL';
// import { propertyRouterPUT } from './routes/property/propertyRoutePUT';
// import { propertyRouterPOST } from './routes/property/propertyRoutePOST';
// import { propertyByIdRouterPATCH } from './routes/property/propertyByIdRoutePATCH';

// import { reservationsRouter } from './routes/reservation/reservationsRoute';
// import { reservationRouterPOST } from './routes/reservation/reservationRoutePOST';
// import { reservationByIdRouter } from './routes/reservation/reservationByIdRoute';
// import { reservationByIdRouterPATCH } from './routes/reservation/reservationByIdRoutePATCH';
// import { reservationByIdRouterDEL } from './routes/reservation/reservationByIdRouteDEL';
// import { reservationByIdRouterPUT } from './routes/reservation/reservationByIdRoutePUT';

const app = express();

//słowo klucz: rabarbar 24.10.2024

app.use(express.json());

const corsOptions: cors.CorsOptions = {
    origin: 'http://localhost:8989', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'X-Content-Type-Options', 'Cache-Control'],
    credentials: true
};

app.use(cors(corsOptions));

const clientData: Array<Record<string, any>> = [];
const propertyData: Array<Record<string, any>> = [];

for (let id = 1; id <= 10; id++) {
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
    apis: ['routes/**/*.js', 'routes/**/*.ts'], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to set headers for all responses
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

// Use the routers
app.use("", clientsRouter);
app.use("", clientIdRouter);
app.use("", clientRouterPOST);
app.use("", clientIdRouterDEL); 
app.use("", clientRouterPATCH);
app.use("", clientByIdRouterPUT);

app.use("", propertiesRouter);
app.use("", propertyIdRouter);
app.use("", propertyIdRouterDEL);
// app.use("", propertyRouterPUT);
// app.use("", propertyRouterPOST);
// app.use("", propertyByIdRouterPATCH);

// app.use("", reservationsRouter);
// app.use("", reservationRouterPOST);
// app.use("", reservationByIdRouter);
// app.use("", reservationByIdRouterPATCH);
// app.use("", reservationByIdRouterDEL);
// app.use("", reservationByIdRouterPUT);

app.listen(8989, () => {
    console.log('Started on 8989');
});