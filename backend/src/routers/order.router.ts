import { Router } from "express";
import asyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { OrderStatus } from "../constants/order_status";
import { OrderModel } from "../models/order.model";
import auth from "../middlewares/auth.mid";

const router = Router();

// используем промежуточное ПО (middlewares)
router.use(auth);

router.post(
  "/create",
  asyncHandler(async (req: any, res: any) => {
    // сохраним заказ из тела запроса
    const requestOrder = req.body;
    // заказ не будет отправлен если в нём нет товаров
    if (requestOrder.items.length <= 0) {
      res.status(HTTP_BAD_REQUEST).send("Cart Is Empty!");
      return;
    }

    // в проекте у пользователя может быть только один новый заказ, поэтому если такой заказ существует, то он будет удалён и затем создаётся новый заказ со статусом: NEW
    await OrderModel.deleteOne({
      // чтобы получить идентификатор пользователя из запроса, нужно промежуточное ПО(middlewares) на этот роутер, которое будет проверять токен пользователя и если он подтверждён, то устанавливало request (запрос)
      user: req.user.id,
      status: OrderStatus.NEW,
    });

    // при создании нового заказа в запрос заказа добавится id заказчика (авторизованного пользователя)
    const newOrder = new OrderModel({ ...requestOrder, user: req.user.id });
    // сохраним новый заказ
    await newOrder.save();
    // отправляем новый заказ клиенту (во фронтенд)
    res.send(newOrder);
  })
);

router.get(
  "/newOrderForCurrentUser",
  asyncHandler(async (req: any, res) => {
    /* const order = await OrderModel.findOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    }); */
    const order = await getNewOrderForCurrentUser(req);
    if (order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
  })
);

router.post(
  "/pay",
  asyncHandler(async (req: any, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(HTTP_BAD_REQUEST).send("Order Not Found!");
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    // сохраняем заказ
    await order.save();

    // идентификатор заказа отправляем клиенту
    res.send(order._id);
  })
);

router.get(
  "/track/:id",
  asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    res.send(order);
  })
);

export default router;

async function getNewOrderForCurrentUser(req: any) {
  return await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  });
}
