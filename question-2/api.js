const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const fs = require("fs");

const itemsDbPath = path.join(__dirname, "db", "items.json");

const PORT = 8000;

const app = express();

app.use(logger("dev"));
app.use(bodyParser.json());

app.post("/items", (req, res) => {
  const newProduct = req.body;
  fs.readFile(itemsDbPath, "utf-8", (err, items) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
    }
    const ParsedInventory = JSON.parse(items);
    newProduct.id = ParsedInventory.length + 1;
    const newInventory = [...ParsedInventory, newProduct];
    fs.writeFile(InventoryJson, JSON.stringify(newInventory), (err) => {
      if (err) {
        res.status(500).json({
          data: null,
          message: "Internal Server Error. Could not save Product to database.",
        });
      }
    });
    res.status(200).send(newProduct);
  });
});

app.get("/items", (req, res) => {
  fs.readFile(itemsDbPath, "utf-8", (err, items) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
      return;
    }
    res.status(200).send(items);
  });
});

app.get("/items/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  fs.readFile(itemsDbPath, "utf-8", (err, items) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
    }
    const ParsedInventory = JSON.parse(items);
    const index = ParsedInventory.findIndex((item) => item.id == id);
    console.log(index);
    if (index == -1) {
      res.status(404).json({
        data: null,
        message: "item not found",
      });
      return;
    }
    res.status(200).send(ParsedInventory[index]);
  });
});

app.patch("/items/:id", (req, res) => {
  const id = req.params.id;
  const upadetedDetails = req.body;
  fs.readFile(itemsDbPath, "utf-8", (err, items) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
      return;
    }
    const ParsedInventory = JSON.parse(items);
    const index = ParsedInventory.findIndex((item) => item.id == id);
    if (index === -1) {
      res.status(404).json({
        data: null,
        message: "item not found",
      });
      return;
    }
    const updateProduct = { ...ParsedInventory[index], ...upadetedDetails };
    ParsedInventory.splice(index, 1, updateProduct);
    fs.writeFile(itemsDbPath, JSON.stringify(ParsedInventory), (err) => {
      if (err) {
        res.status(500).json({
          data: null,
          message: "Internal Server Error. Could not save Product to database.",
        });
      }
    });
    res.status(200).send(updateProduct);
  });
});

app.delete("/items/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile(itemsDbPath, "utf-8", (err, items) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
      return;
    }
    const ParsedInventory = JSON.parse(items);
    const index = ParsedInventory.findIndex((item) => item.id == id);
    if (index === -1) {
      res.status(404).json({
        data: null,
        message: "item not found",
      });
      return;
    }
    const deletedProduct = ParsedInventory.splice(index, 1);
    fs.writeFile(itemsDbPath, JSON.stringify(ParsedInventory), (err) => {
      if (err) {
        res.status(404).json({
          data: null,
          message: "item not found",
        });
        return;
      }
      res.status(200).send(deletedProduct);
    });
  });
});

app.listen(PORT, () => {
  console.log(`server listening on the http://localhost:${PORT}`);
});
