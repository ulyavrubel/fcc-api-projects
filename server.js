const express = require("express");
const cors = require("cors");
const ip = require("ip");

const app = express();

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

app.listen(3000);
