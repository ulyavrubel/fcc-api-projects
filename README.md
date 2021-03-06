# fcc-api-projects
RESTful API built with MongoDB, Node.js, and Express for [freeCodeCamp](https://www.freecodecamp.org/learn) APIs and Microservices Certification.

## Table of Contents
* [Introduction](#introduction)
* [Demos](#demos)
* [Technologies](#technologies)
* [Features](#features)

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
Timestamp Microservice parses timestamp in milliseconds or date string from the API endpoint and returns returns a JSON with timestamp and date.

### Request Header Parser Microservice
Request Header Parser Microservice gets the IP address, preferred languages, and system info of the client's device.

### URL Shortener Microservice
URL Shortener Microservice allows to post url and receive a shortened URL which could be copied. Visiting the shortened URL will redirect to the original link.

### Exercise Tracker Microservice
Exercise Tracker Microservice allows to create user, to add an exercise to any user, to get user's exercise log optionally for selected period.

### File Metadata Microservice
File Metadata Microservice allows to submit a form object that includes a file upload, on submit receive JSON with file's name, type and size.
