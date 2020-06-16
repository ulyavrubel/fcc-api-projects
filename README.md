# fcc-api-projects
RESTful API built with MongoDB, Node.js, and Express for [freeCodeCamp](www.freeCodeCamp.com) APIs and Microservices Certification.

## Table of Contents
* [Introduction](#introduction)
* [Demos](#demos)
* [Technologies](#technologies)
* [Features](#features)
* [To-do](#to-do)

## Introduction
This project is a result of my learning the backend basics with freeCodeCamp APIs and Microservices, which includes the following sections: 
* Managing Packages with Npm
* Basic Node and Express
* MongoDB and Mongoose

## Demos
To complete this block and get the certificate I've built 5 small node.js apps, live demos below:
* [Timestamp Microservice](https://freecodecamp-api-projects.herokuapp.com/timestamp)
* [Request Header Parser Microservice](https://freecodecamp-api-projects.herokuapp.com/whoami)
* [URL Shortener Microservice](https://freecodecamp-api-projects.herokuapp.com/url-shortener)
* [Exercise Tracker Microservice](https://freecodecamp-api-projects.herokuapp.com/exercise-tracker)
* [File Metadata Microservice](https://freecodecamp-api-projects.herokuapp.com/file-metadata)

## Technologies
Technologies I used for this project:
* Node.js 12.13
* Express 4.17
* Mongoose 5.9

## Features
### Timestamp Microservice
Timestamp Microservice parses timestamp in milliseconds or date string from the API endpoint and returns a JSON having a structure {"unix": <date.getTime()>, "utc" : <date.toUTCString()> }
