const express = require("express");
const path = require("path");
const fs = require("fs");
const indexPage = path.join(__dirname, "public", "index.html");
const errorPage = path.join(__dirname, "public", "404.html");
const PORT = 8000;
const app = express();

app.get("/", (req, res) => {
  res.setHeader("content-type", "text/html");
  res.status(200);
  res.send("a web server");
});

app.get("/index.html", (req, res) => {
  fs.readFile(indexPage, "utf-8", (err, data) => {
    if (err) {
      res.status(404);
      res.send("an error occured");
      return;
    }
    res.status(200);
    res.send(data);
  });
});

app.get("*", (req, res) => {
  fs.readFile(errorPage, "utf-8", (err, data) => {
    if (err) {
      res.status(404);
      res.send("an error occured");
      return;
    }
    res.status(200);
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`server is listening at http://localhost:${PORT}`);
});
