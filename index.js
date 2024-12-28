require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

const urlIdSet = [];
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", function (req, res) {
  const { url } = req.body;
  const urlRegex = /^(http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(url)) {
    res.json({ error: "invalid url" });
    return;
  }
  const id = urlIdSet.length + 1;
  urlIdSet.push({ id, url });
  res.json({ original_url: url, short_url: id });
});

app.get("/api/shorturl/:id", function (req, res) {
  const { id } = req.params;
  const url = urlIdSet.find((url) => url.id == id);
  if (!url) {
    res.json({ error: "No short url found for given input" });
    return;
  }
  res.redirect(url.url);
});
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
