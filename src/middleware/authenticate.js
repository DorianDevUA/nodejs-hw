import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export const authenticate = async (req, res, next) => {
  // Перевіряємо cookies. Якщо немає — відмовляємо у доступі.
  const { sessionId, accessToken } = req.cookies;

  // Перевірка згідно умови ДЗ (можна видалити, наступна перевірка покриває дану умову)
  if (!accessToken) {
    throw createHttpError(401, 'Missing access token');
  }

  // 1. Перевіряємо наявність кукі
  if (!sessionId || !accessToken) {
    throw createHttpError(401, 'Missing session credentials');
  }

  // Шукаємо сесію: чи існує в базі сесія з таким токеном.
  // 2. Якщо все ок, шукаємо сесію
  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  // 3. Якщо такої сесії нема, повертаємо помилку
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Перевіряємо строк дії токена: якщо він прострочений — користувач має оновити сесію.
  // 4. Перевіряємо термін дії access токена
  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();

  if (isAccessTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  // Шукаємо користувача: якщо сесія дійсна, але користувач у базі видалений — доступ також забороняється.
  // 5. Якщо з токеном все добре і сесія існує, шукаємо користувача
  const user = await User.findOne({ _id: session.userId });

  // 6. Якщо користувача не знайдено, повертаємо помилку
  if (!user) {
    throw createHttpError(401);
  }

  // Додаємо користувача у req: після цього контролери зможуть отримати інформацію про нього (req.user).
  // 7. Якщо користувач існує, додаємо його до запиту
  req.user = user;

  // 8. Передаємо управління далі
  next();
};
