import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import { registerValidation, loginValidation } from "../validations/auth.js";
import * as userController from "../controllers/userController.js";
import authCheck from "../utils/authCheck.js";

mongoose
  .connect(
    "mongodb+srv://darhankusajn:h2vcvoA3Aj5gPRQE@cluster.mtnhmsh.mongodb.net/login?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB err", err));

const app = express();

// Пробывали через юрл кидать файлы и вывести на профиль
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json());

// cors для того что бы сделать запрос из другога хоста ну унас в реакт 3000 а тут 4000 (middleware)
app.use(cors());

app.use("/uploads", express.static("uploads"));

// Запросы
app.post("/home", authCheck, userController.tablePost);
app.post("/auth/login", loginValidation, userController.login);
app.post("/auth/register", registerValidation, userController.register);

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/table", userController.getTable);

// port номер 4000
app.listen(4000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server is OK");
});
