import { connect, ConnectOptions } from "mongoose";

export const dbConnect = () => {
  connect(
    process.env.MONGO_URI! /* , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions */
  ).then(
    () => console.log("Connect successfully !!!"),
    (error) => console.log(error)
  );
};
