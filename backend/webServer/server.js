import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit'

import { log, logError } from '../logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { convertToString } from './middlewares/validate.js';
import * as manager from './middlewares/manager.js';

import coinRoutes from './routes/coinRoutes.js';
import userRoutes from './routes/userRoutes.js';
import generalRoutes from './routes/generalRoutes.js'


const connectToDatabase = async () => {
	try {
		db = await manager.connectDB();
		app.locals.db = db;
		app.listen(port, () => {
			log('Database Connection', `Server is running on localhost:${port}`);
		});
	} catch (error) {
		logError(error);
		process.exit(1);
	}
};


export const app = express();
export let db;
connectToDatabase();

const port = process.env.PORT;


const corsOptions = {
	origin: `*`,// Allow only this origin
	methods: 'GET,PUT,POST', // Allowed HTTP methods
	preflightContinue: false, // Pass the CORS preflight response to the next handler
	optionsSuccessStatus: 204, // Respond with 204 for successful OPTIONS requests
	allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};


const limiter = rateLimit({
	windowMs: 1 * 60 * 1000,
	max: 3000 
});
app.use(cors(corsOptions));
app.use(limiter);
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('combined'));
app.use(convertToString());

app.use('/*', generalRoutes);
app.use('/coin', coinRoutes);
app.use('/user', userRoutes);

app.use(errorHandler); 

export default app;

