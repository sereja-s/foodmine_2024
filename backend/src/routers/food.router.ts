import { Router } from "express";
import { sample_foods, sample_tags } from "../data";
import asyncHandler from "express-async-handler";
import { FoodModel } from "../models/food.model";

const router = Router();

// Первоначальное заполнение БД товарами, если их там нет
router.get(
  "/seed",
  asyncHandler(async (req, res) => {
    const foodsCount = await FoodModel.countDocuments();
    if (foodsCount > 0) {
      res.send("Seed foods is already done !");
      return;
    }
    await FoodModel.create(sample_foods);
    res.send("Seed foods Is Done !");
  })
);

// определим api для получения всех товаров
/* router.get("/api/foods", (req, res) => {
  res.send(sample_foods);
}); */
// перенесли часть функционала в роутер товаров
/* router.get("/", (req, res) => {
  res.send(sample_foods);
});
 */
// Получим все значения из БД испольуя обработчик асинхронных запросов
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find();
    res.send(foods);
  })
);

// определим api для получения всех товаров по поисковому запросу (в запросе после адреса api (в конце после :) укажем параметр запроса)
/* router.get("/search/:searchTerm", (req, res) => {
  // получим параметр запроса из запроса на поиск товара по этому параметру
  const searchTerm = req.params.searchTerm;
  const foods = sample_foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // отправим ответ
  res.send(foods);
}); */
// получм все товары из БД по поисковому запросу, используя обработчик асинхронных запросов и регулярное выражение для регисторонезависимого поиска
router.get(
  "/search/:searchTerm",
  asyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await FoodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

// api для получения всех тэгов
/* router.get("/tags", (req, res) => {
  res.send(sample_tags);
}); */
// Получим все тэги по асинхронному запросу в БД, используя обработчик асинхронных запросов
router.get(
  "/tags",
  asyncHandler(async (req, res) => {
    // сделаем агрегацию с помощью модели
    const tags = await FoodModel.aggregate([
      {
        // операция: "$поле с которым выполняется операция"
        // принцип- имеем 2-а товара и у каждого по 3-и тэга, после операции- $unwind с полем- $tags, получим 6-ть товаров по 1-му тэгу у каждого (тэги, которые были массивом превращаются в обычное поле с одним значением). Так мы  можем сгруппировать похожие продукты и посчитать их
        $unwind: "$tags",
      },
      {
        // группируем элементы
        $group: {
          // внутри группы есть поле с идентификатором группы (т.е. здесь это группа продуктов с общим тегом, имеющим id)
          _id: "$tags",
          // также имеется поле: количество продуктов для каждого тэга (в нём будет результат суммирования со значением: 1)
          count: { $sum: 1 },
        },
      },
      {
        // полученную группу с тэгами и количеством товаров для кождого, можем спроецировать и сделать структуру, похожую на интерфейс
        $project: {
          _id: 0,
          name: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });

    const all = {
      name: "All",
      count: await FoodModel.countDocuments(),
    };
    tags.unshift(all);
    res.send(tags);
  })
);

// api для получения товаров по заданному тэгу
/* router.get("/tag/:tagName", (req, res) => {
  const tagName = req.params.tagName;
  const foods = sample_foods.filter((food) => food.tags?.includes(tagName));
  res.send(foods);
}); */
// Получим товары по указанному тэгу, используя аихронный запрос и обработчик асинхронного запроса
router.get(
  "/tag/:tagName",
  asyncHandler(async (req, res) => {
    const foods = await FoodModel.find({ tags: req.params.tagName });
    res.send(foods);
  })
);

// api для получения товар по заданному id товара
/* router.get("/:foodId", (req, res) => {
  const foodId = req.params.foodId;
  const food = sample_foods.find((food) => food.id == foodId);
  res.send(food);
}); */
// Получим товар по заданному в адресной строке Id с использованием асинхронного запроса и его обработчика
router.get(
  "/:foodId",
  asyncHandler(async (req, res) => {
    const food = await FoodModel.findById(req.params.foodId);
    res.send(food);
  })
);

// обязательно экспортируем модуль роутера по умолчанию, чтобы его можно было ипортировать(использовать в других файлах)
export default router;
