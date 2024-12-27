import { model, Schema } from "mongoose";

export interface Food {
  id: string;
  name: string;
  price: number;
  tags: string[];
  favorite: boolean;
  stars: number;
  imageUrl: string;
  origins: string[];
  cookTime: string;
}

export const FoodSchema = new Schema<Food>(
  // в качестве прараметра конструктора укажем все поля (здесь- без id т.к. он стандартный элемент таблицы БД) и их типы (здесь- с большой буквы) в mongodb
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: [String] },
    favorite: { type: Boolean, default: false },
    stars: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    origins: { type: [String], required: true },
    cookTime: { type: String, required: true },
  },
  {
    // виртуальные поля в значении: true (установит знак _ перед id в БД)
    toJSON: {
      virtuals: true,
    },
    // разрешаем получение значений из БД для работы с ними в коде
    toObject: {
      virtuals: true,
    },
    // разрешаем автоматически добавлять время создания и обновления модели
    timestamps: true,
  }
);

export const FoodModel = model<Food>("food", FoodSchema);
