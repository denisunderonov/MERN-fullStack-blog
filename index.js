import express from "express";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/auth/login", (req, res) => {
  const token = jwt.sign({
    email: req.body.email,
    fullname: 'Denis'
  }, 'secret123');

  res.json({
    token
  })
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK!");
});
