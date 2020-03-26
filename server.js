const express = require("express");
const cors = require("cors");
const ip = require("ip");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const dns = require("dns");
const url = require("url");
const shortid = require("shortid");
const multer = require("multer");
const port = process.env.PORT || 8080;

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

app.route("/exercise-tracker").get(function(req, res) {
  res.sendFile(__dirname + "/public/exerciseTracker.html");
});

app.route("/file-metadata").get(function(req, res) {
  res.sendFile(__dirname + "/public/fileMetadata.html");
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
const urlencodedParser = bodyParser.urlencoded({ extended: false });

//creating unique 6-char identifier
const generateHash = function() {
  const ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const ID_LENGTH = 6;
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
              // link: `${req.headers.origin}/api/shorturl/${urlObj.hash}`
              link: `${req.headers.origin}/sh/${urlObj.hash}`
            });
      });
    }
  });
});

app.get("/resultURL", (req, res) => {
  res.render("resultURL");
});

app.get("/sh/:hash", function(req, res) {
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

//project 4 Exercise tracker

const userSchema = new Schema({
  _id: { type: String, default: shortid.generate },
  userName: { type: String, required: true },
  count: { type: Number },
  log: [
    {
      description: String,
      duration: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model("User", userSchema);

//create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id
app.post("/api/exercise/new-user", urlencodedParser, function(req, res) {
  User.create({ userName: req.body.username, count: 0, log: [] }, function(
    err,
    result
  ) {
    err
      ? res.json(err)
      : res.json({ username: req.body.username, _id: result._id });
  });
});

//add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add
app.post("/api/exercise/add", urlencodedParser, function(req, res) {
  User.findById({ _id: req.body.userId }, function(err, result) {
    if (err) {
      res.json(err);
    } else {
      result.count = result.count + 1;
      let setDate;
      req.body.date
        ? (setDate = new Date(req.body.date))
        : (setDate = undefined);
      result.log.push({
        description: req.body.description,
        duration: Number(req.body.duration),
        date: setDate
      });
      result.save(function(err, result) {
        err
          ? res.json(err)
          : res.json({
              username: result.userName,
              count: result.count,
              log: result.log
            });
      });
    }
  });
});

//get an array of all users by getting api/exercise/users with the same info as when creating a user
app.get("/api/exercise/users", function(req, res) {
  User.find({}, function(err, result) {
    if (err) {
      res.json(err);
    } else {
      let results = result.map(item => {
        return {
          username: item.userName,
          _id: item._id
        };
      });
      res.json(results);
    }
  });
});

//retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id)
app.get("/api/exercise/log/:userId/:from?/:to?/:limit?", function(req, res) {
  User.findById({ _id: req.params.userId }, function(err, result) {
    if (err) {
      res.json(err);
    } else {
      let results = result.log.filter(item => {
        let targetD = new Date(item.date);
        let fromD;
        req.params.from ? (fromD = new Date(req.params.from)) : (fromD = 0);
        let toD;
        req.params.to ? (toD = new Date(req.params.to)) : (toD = Infinity);
        return targetD >= fromD && targetD <= toD;
      });
      if (req.params.limit) {
        results.splice(req.params.limit);
      }
      res.json(results);
    }
  });
});

//project 5 file metadata

const upload = multer();

app.post("/api/fileanalyse", upload.single("upfile"), function(req, res) {
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

app.listen(port, function() {
  console.log("app running on port 8080");
});
