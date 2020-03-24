const express = require("express");
const cors = require("cors");
const ip = require("ip");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const dns = require("dns");
const url = require("url");

const app = express();
dotenv.config();

app.use(cors({ optionSuccessStatus: 200 }));
app.use(express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.set("view engine", "pug");

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

// app.route("/api/shorturl/:hash").get(function(req, res) {
//   res.sendFile(__dirname + "/public/resultURL.html");
// });

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
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//creating unique 8-char identifier
const generateHash = function() {
  const ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ID_LENGTH = 8;
  let rtn = "";
  for (let i = 0; i < ID_LENGTH; i++) {
    rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return rtn;
};

//mongoose schema
const Schema = mongoose.Schema;

const urlObjSchema = new Schema({
  url: { type: String, required: true },
  hash: { type: String, required: true }
});

const UrlObj = mongoose.model("UrlObj", urlObjSchema);

app.post("/resultURL", urlencodedParser, function(req, res) {
  let parsedUrl = url.parse(req.body.url);
  dns.lookup(parsedUrl.hostname, function(err) {
    if (err) {
      res.json({ error: "invalid URL" });
    } else {
      let urlObj = { url: req.body.url, hash: generateHash() };
      UrlObj.create(urlObj, function(err) {
        err
          ? res.json(err)
          : res.render("resultURL", {
              link: `${req.headers.origin}/api/shorturl/${urlObj.hash}`
            });
      });
    }
  });
});

app.get("/resultURL", (req, res) => {
  res.render("resultURL");
});

app.get("/api/shorturl/:hash", function(req, res) {
  UrlObj.findOne({ hash: req.params.hash }, function(err, result) {
    if (err) {
      res.json(err);
    } else {
      let changedUrl = result.url;
      if (result.url.slice(0, 3) === "www") {
        changedUrl = "https://" + result.url.slice(4);
      }
      res.redirect(changedUrl);
    }
  });
});

app.listen(3000);
