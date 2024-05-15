import express from "express";
import mongoose from "mongoose";
import {
  registerValidator,
  loginValidator,
  postCreateValidation
} from "./validations.js";
import checkAuth from "./utils/CheckAuth.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

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

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/auth/login", loginValidator, UserController.login);

app.post("/auth/register", registerValidator, UserController.register);

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);
// app.delete("/posts", PostController.remove);
// app.patch("/posts", PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK!");
});
