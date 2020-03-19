const express = require("express");
const cors = require("cors");
const ip = require("ip");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const dns = require("dns");

const app = express();
dotenv.config();

app.use(cors({ optionSuccessStatus: 200 }));
app.use(express.static("public"));

app.route("/").get(function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.route("/timestamp").get(function(req, res) {
  res.sendFile(__dirname + "/public/timestamp.html");
});

app.route("/whoami").get(function(req, res) {
  res.sendFile(__dirname + "/public/whoami.html");
});

app.route("/url-shortener").get(function(req, res) {
  res.sendFile(__dirname + "/public/url-shortener.html");
});

//Project 1 - Timestamp Microservice - get route parameter input from the client
app.get("/api/timestamp/:date_string?", (req, res) => {
  console.log(req.params.date_string);
  console.log(typeof req.params.date_string);
  let date;
  let unix;
  let utc;

  if (!req.params.date_string) {
    date = new Date();
    unix = date.getTime();
    utc = date.toUTCString();
  } else {
    date = new Date(req.params.date_string);
    if (isNaN(date.getTime())) {
      date = new Date(Number(req.params.date_string));
    }
    if (isNaN(date.getTime())) {
      res.json({ error: "Invalid Date" });
    }

    unix = date.getTime();
    utc = date.toUTCString();
  }

  res.json({ unix: unix, utc: utc });
});

//Project 2 - header parser
app.get("/api/whoami/check", function(req, res) {
  let ipaddress = ip.address();
  let lang = req.headers["accept-language"];
  let soft = req.headers["user-agent"];
  res.json({ ipaddress: ipaddress, language: lang, software: soft });
});

//project3 - url shortener

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-xgb1n.mongodb.net/test?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    () => {
      console.log(mongoose.connection.readyState); //0: disconnected 1: connected 2: connecting 3: disconnecting
    }
  )
  .catch(err => {
    console.log(err);
  });

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/api/shorturl/new", urlencodedParser, function(req, res) {
  console.log(req.body.url);
  dns.lookup(req.body.url, function(err, addresses, family) {
    console.log(err, addresses, family);
  });
  res.json({ original_url: req.body.url, short_url: "???" });
});

app.listen(3000);
