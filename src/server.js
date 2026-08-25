import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger); // 1. Логер першим — бачить усі запити
app.use(
  express.json({
    type: ['application/json', 'application/vnd.api+json'],
  }),
); // 2. Парсинг JSON-тіла
app.use(cors()); // 3. Дозвіл для запитів з інших доменів

app.use(notesRoutes); // підключаємо групу маршрутів нотаток

app.use(notFoundHandler); // Middleware 404 (після всіх маршрутів) для неіснуючих маршрутів
app.use(errorHandler); // Middleware для обробки помилок

await connectMongoDB(); // підключення до MongoDB

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
