// Промежуточное ПО для проверки идентификации (подлинности пользователя) при отправки запросов к API, если это требуется -
// это функция которая получает запрос ответ и следующее действие
import { verify } from "jsonwebtoken";
import { HTTP_UNAUTHORIZED } from "../constants/http_status";

export default (req: any, res: any, next: any) => {
  // поучим токен из заголовка
  const token = req.headers.access_token as string;
  if (!token) return res.status(HTTP_UNAUTHORIZED).send();

  try {
    // декодируем токен пользователя (для этого передаём токен и секретный ключ, который использовался для сщздания токена)
    const decodedUser = verify(token, process.env.JWT_SECRET!);
    req.user = decodedUser;

    // если токен не пройдёт проверку, будет выброшено исключение
    // перехватим его
  } catch (error) {
    res.status(HTTP_UNAUTHORIZED).send();
  }

  return next();
};
