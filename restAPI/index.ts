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
    },
    apis: ['restAPI/routes/**/*.js', 'restAPI/routes/**/*.ts'],
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