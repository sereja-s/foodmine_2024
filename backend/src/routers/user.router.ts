import { Router } from "express";
import { sample_users } from "../data";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";

const router = Router();

// Первоначальное заполнение БД пользователями
router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed users is already done !");
      return;
    }
    await UserModel.create(sample_users);
    res.send("Seed users Is Done !");
  })
);

// api для отправки данных из формы на сервер для процесса авторизации
//router.post("/login", (req, res) => {
// сохраним данные из запроса, т.е. тело запроса (здесь- email и password) отправляемые на сервер в формате json
//const body = req.body;
// извлечём элементы из тела запроса и получим их в отдельные поля(свойства) объекта.
// Это называется деструктуризация присваивания
//const { email, password } = req.body;
/* const user = sample_users.find((user) => {
	  user.email === body.email && user.password === body.password;
	}); */
//const user = sample_users.find(
//  (user) => user.email === email && user.password === password
//);
//if (user) {
// отправим клиенту успешный ответ, содержаций пользователя и токен (зашифрованный текст, который должен быть сохранён клиентом и отправляться с каждым запросом чтобы сервер мог его расшифровать и понять кто именно отправил запрос)
//  res.send(generateTokenResponse(user));
//} else {
//  res.status(400).send("UserName or Password is invalid!");
//}
// Процесс авторизации с использованием асинхронного запроса к БД и его обработчика
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    // сохраним данные из запроса, т.е. тело запроса (здесь- email и password) отправляемые на сервер в формате json
    //const body = req.body;
    // извлечём элементы из тела запроса и получим их в отдельные поля(свойства) объекта.
    // Это называется деструктуризация присваивания
    const { email, password } = req.body;
    /* const user = sample_users.find((user) => {
		 user.email === body.email && user.password === body.password;
	  }); */
    const user = await UserModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // отправим клиенту успешный ответ, содержаций пользователя и токен (зашифрованный текст, который должен быть сохранён клиентом и отправляться с каждым запросом чтобы сервер мог его расшифровать и понять кто именно отправил запрос)
      res.send(generateTokenResponse(user));
    } else {
      res.status(HTTP_BAD_REQUEST).send("UserName or Password is invalid!");
    }
  })
);

// api для регистрации нового пользователя
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    // получим все поля от клиента
    const { name, email, password, address } = req.body;
    // проверим есть ли в БД пользователь с эл. почтой указанной пользователем при регистрации
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(HTTP_BAD_REQUEST).send("User is already exist! Please login");
      return;
    }
    // в сонстанту сохраним зашифрованный пароль (здесь- 10 символов (соль))
    const encryptedPassword = await bcrypt.hash(password, 10);
    // создадим пользователя на основе данных из тела запроса
    const newUser: User = {
      id: "",
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      address,
      isAdmin: false,
    };
    // сохраним пользователя в БД
    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenResponse(dbUser));
  })
);

/**
 *  функция для генерации токена. Процесс генерации токена назвается подписью
 */
const generateTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      // в первом параметре передайм то что мы хотим закодировать
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    // во 2-ом параметре указываем секретный ключ
    process.env.JWT_SECRET!,
    {
      // 3-ий параметр это опции. Мы укажем время действия токена (здесь- 30 дней)
      expiresIn: "30d",
    }
  );
  /* user.token = token;
  return user; */
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token: token,
  };
};

export default router;
