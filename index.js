import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { registerValidator } from "./validations/auth.js";
import UserModel from "./models/User.js";
import bcrypt from "bcrypt";

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

app.post("/auth/register", registerValidator, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign({
      _id:user._id
    },'secret123', {
      expiresIn: '30d'
    })

    const {passwordHash, ...userData} = user._doc;

    res.json({
      ...userData,
      token
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Регистрация не удалась',
    })
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK!");
});
