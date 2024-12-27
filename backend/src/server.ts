import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { sample_foods, sample_tags, sample_users } from "./data";
import jwt from "jsonwebtoken";
import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";

import { dbConnect } from "./configs/database.config";
import orderRouter from "./routers/order.router";

dbConnect();

// создадим web-приложение
const app = express();
// подключим приложении подержку формата json, что бы получать запросы с данными из заполненной формы,т.е. с body(телом запроса) в формате json
app.use(express.json());
// для процесса разработки разработки свяжем адреса портов на которых работает frontend и backend (запрос с одного адреса будет передаваться на ддругой адрес)
app.use(
  cors({
    credentials: true, // учётные данные
    origin: ["http://localhost:4200"], // источник
  })
);

// применим api для продуктов из роутера продуктов
app.use("/api/foods", foodRouter);

app.use("/api/users", userRouter);

app.use("/api/orders", orderRouter);

/* // определим api для получения всех товаров
app.get("/api/foods", (req, res) => {
	res.send(sample_foods);
 });
 
 // определим api для получения всех товаров по поисковому запросу (в запросе после адреса api (в конце после :) укажем параметр запроса)
 app.get("/api/foods/search/:searchTerm", (req, res) => {
	// получим параметр запроса из запроса на поиск товара по этому параметру
	const searchTerm = req.params.searchTerm;
	const foods = sample_foods.filter((food) =>
	  food.name.toLowerCase().includes(searchTerm.toLowerCase())
	);
	// отправим ответ
	res.send(foods);
 });
 
 // api для получения всех тэгов
 app.get("/api/foods/tags", (req, res) => {
	res.send(sample_tags);
 });
 
 // api для получения товаров по заданному тэгу
 app.get("/api/foods/tag/:tagName", (req, res) => {
	const tagName = req.params.tagName;
	const foods = sample_foods.filter((food) => food.tags?.includes(tagName));
 
	res.send(foods);
 });
 
 // api для получения товаров по заданному id товара
 app.get("/api/foods/:foodId", (req, res) => {
	const foodId = req.params.foodId;
	const food = sample_foods.find((food) => food.id == foodId);
 
	res.send(food);
 }); */

// определим константу для порта и организуем его прослушивание приложением
const port = 5000;
app.listen(port, () => {
  console.log("Website served on http://localhost:" + port);
});
