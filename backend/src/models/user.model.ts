import { model, Schema } from "mongoose";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  address: string;
  isAdmin: boolean;
}

export const UserSchema = new Schema<User>(
  // в качестве прараметра конструктора укажем все поля (здесь- без id т.к. он стандартный элемент таблицы БД) и их типы (здесь- с большой буквы) в mongodb
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
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

export const UserModel = model<User>("user", UserSchema);
