import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import {
  registerValidator,
  loginValidator,
  postCreateValidation,
} from "./validations.js";
import checkAuth from "./utils/CheckAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

const url =
  "mongodb+srv://admin:Denimz13.@cluster0.izogo3m.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(url)
  .then(() => {
    console.log("DB okay");
  })
  .catch((e) => {
    console.log("error: ", e);
  });

const app = express();

const storage = multer.diskStorage({
  destination:
    ("",
    "",
    (cb) => {
      cb(null, "uploads");
    }),
  filename: (a, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/auth/me", checkAuth, UserController.getMe);

app.post(
  "/auth/login",
  loginValidator,
  handleValidationErrors,
  UserController.login
);

app.post(
  "/auth/register",
  registerValidator,
  handleValidationErrors,
  UserController.register
);

app.post("/uploads", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", checkAuth, PostController.getAll);
app.get("/posts/:id", checkAuth, PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch("/posts", PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK!");
});
