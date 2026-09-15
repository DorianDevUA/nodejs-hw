import express from 'express';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import 'dotenv/config';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger); // 1. Логер першим — бачить усі запити
app.use(
  express.json({
    type: ['application/json', 'application/vnd.api+json'],
  }),
); // 2. Парсинг JSON-тіла
// app.use(express.static('public')); // Для роздачі статичних файлів з папки public
app.use(express.static(path.join(import.meta.dirname, 'public')));
app.use(cors()); // 3. Дозвіл для запитів з інших доменів
app.use(cookieParser()); // 4. Парсер cookies

app.use(authRoutes); // підключаємо групу маршрутів /auth
app.use(userRoutes); // підключаємо групу маршрутів /users
app.use(notesRoutes); // підключаємо групу маршрутів /notes

app.use(notFoundHandler); // Middleware 404 (після всіх маршрутів) для неіснуючих маршрутів
app.use(errors()); // обробка помилок від celebrate (валідація)
app.use(errorHandler); // Middleware для обробки помилок

await connectMongoDB(); // підключення до MongoDB

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
