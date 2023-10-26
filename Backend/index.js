import express from "express";
import { PORT } from "./config.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send(`Welcome to CE WEB.`);
});

app.listen(PORT, () => {
  console.log(`app is listening to PORT ${PORT}`);
});
