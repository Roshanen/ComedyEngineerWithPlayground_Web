import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import cors from "cors";
import signRoute from "./routes/signRoute.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import postRoute from "./routes/postRoute.js";
import checkKey from "./middlewares/checkKey.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(checkKey);

app.get("/", (req, res) => {
  return res.status(200).send(`Welcome to CE WEB.`);
});
app.use("/sign", signRoute);
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/post", postRoute);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
