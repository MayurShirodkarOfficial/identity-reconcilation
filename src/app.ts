import express from 'express';
import { DataSourceConfig } from './config/typeORMConfig';
import { requestLogger } from './middlewares/logger.middleware';
import identifyRouter from './routes/identifyRouter';

const app = express();
//db connection
DataSourceConfig.initialize()
    .then(async () => {
        console.log("Connected To DB!");
    })
    .catch((error) => console.log(error));

// Add CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Logging middleware
app.use(requestLogger);
app.use(express.json());
//routes
app.use('/identify',identifyRouter);
export default app;
