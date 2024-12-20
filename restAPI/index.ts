import express, { Request, Response, NextFunction } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors, { CorsOptions } from 'cors';
import {
    clientIdRouter,
    clientRouterPOST,
    clientsRouter,
    clientIdRouterDEL,
    clientRouterPATCH,
    clientByIdRouterPUT
} from './routes/clientRouteImport';
import {
    propertiesRouter,
    propertyIdRouter,
    propertyIdRouterDEL,
    propertyRouterPUT,
    propertyRouterPOST,
    propertyByIdRouterPATCH
} from './routes/propertyRouteImport';
import {
    reservationsRouter,
    reservationRouterPOST,
    reservationByIdRouter,
    reservationByIdRouterPATCH,
    reservationByIdRouterDEL,
    reservationByIdRouterPUT
} from './routes/reservationRouteImport';

const app = express();

app.use(express.json());

const corsOptions: CorsOptions = {
    origin: 'http://localhost:8989',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'X-Content-Type-Options', 'Cache-Control'],
    credentials: true
};

app.use(cors(corsOptions));

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
        tags: [
            { name: 'Property', description: 'Property management endpoints' },
            { name: 'Client', description: 'Client management endpoints' },
            { name: 'Reservation', description: 'Reservation management endpoints' }
        ],
        components: {
            schemas: {
                Client: {
                    type: 'object',
                    properties: {
                        id: { 
                            type: 'integer', 
                            example: 1 
                        },
                        name: { 
                            type: 'string', 
                            example: 'John Doe' 
                        },
                        email: { 
                            type: 'string', 
                            format: 'email',
                            example: 'john.doe@example.com' 
                        },
                        phone: { 
                            type: 'string',
                            pattern: '^\+?[0-9]{9,}$',
                            example: '+48123456789' 
                        },
                        address: { 
                            type: 'string',
                            example: '123 Main St' 
                        },
                    }
                },
                Property: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        address: { type: 'string', example: 'ul. Przykładowa 123' },
                        description: { type: 'string' },
                        rooms: { type: 'integer', minimum: 1 },
                        surfaceArea: { type: 'number', minimum: 0 },
                        status: { type: 'string', enum: ['for sale', 'sold', 'for rent', 'rented'] },
                        type: { type: 'string', enum: ['house', 'apartment', 'land'] },
                        price: { type: 'number' },
                        rent: { type: 'number' }
                    }
                },
                Reservation: {
                    type: 'object',
                    properties: {
                        id: { 
                            type: 'integer', 
                            example: 1 
                        },
                        propertyId: { 
                            type: 'integer', 
                            example: 6 
                        },
                        clientId: { 
                            type: 'integer', 
                            example: 3 
                        },
                        date: {
                            type: 'object',
                            properties: {
                                start: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2024-10-16T14:39:31.088Z'
                                },
                                end: {
                                    type: 'string',
                                    format: 'date-time',
                                    example: '2024-10-19T14:39:31.088Z'
                                }
                            }
                        }
                    }
                }
            },
        }
    },
    apis: ['restAPI/routes/**/*.js', 'restAPI/routes/**/*.ts']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware to set headers for all responses
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-eval'");
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
    console.log('Server (RestAPI) started on 8989');
});