const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));
app.use(bodyParser.urlencoded({ extended: true }));

let corsOptions = {
  origin: "*",
  credential: true,
};

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use(cors(corsOptions));

const db = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB, 
});

app.post("/leaderlogin", (req, res) => {
  var LEADER_NAME = req.body.LEADER_NAME;
  var LEADER_PW = req.body.LEADER_PW;

  const sqlQuery =
    "SELECT LEADER_NAME, LEADER_PW, count(*) as 'cnt' FROM LEADER_TBL WHERE LEADER_NAME=? AND LEADER_PW=?;";
    db.query(sqlQuery, [LEADER_NAME, LEADER_PW], (err, result) => {
    res.send(result); 
  });
});

app.post("/leaderjoin", (req, res) => {
  var LEADER_NAME = req.body.LEADER_NAME;
  var LEADER_PW = req.body.LEADER_PW;
  var LEADER_TEAM = req.body.LEADER_TEAM;
  var LEADER_GRADE = req.body.LEADER_GRADE;
  var LEADER_CLASS = req.body.LEADER_CLASS;
  var LEADER_COIN = 10


  const sqlQuery =
    "INSERT INTO LEADER_TBL VALUES (?,?,?,?,?,?);";
  db.query(sqlQuery, [LEADER_NAME, LEADER_PW, LEADER_TEAM, LEADER_GRADE, LEADER_CLASS, LEADER_COIN], (err, result) => {
    res.send(result);
  });
});

app.post("/memberlogin", (req, res) => {
  var MEMBER_NAME = req.body.MEMBER_NAME;
  var MEMBER_PW = req.body.MEMBER_PW;

  const sqlQuery =
    "SELECT MEMBER_NAME, MEMBER_PW, count(*) as 'cnt' FROM MEMBER_TBL WHERE MEMBER_NAME=? AND MEMBER_PW=?;";
  db.query(sqlQuery, [MEMBER_NAME, MEMBER_PW], (err, result) => {
    res.send(result); 
  });
});

app.post("/memberjoin", (req, res) => {
  var MEMBER_NAME = req.body.MEMBER_NAME;
  var MEMBER_PW = req.body.MEMBER_PW;
  var MEMBER_CLASS = req.body.MEMBER_CLASS;
  var MEMBER_GACHI = req.body.MEMBER_GACHI;

  const sqlQuery =
    "INSERT INTO MEMBER_TBL VALUES (?,?,?,?);";
  db.query(sqlQuery, [MEMBER_NAME, MEMBER_PW, MEMBER_CLASS, MEMBER_GACHI], (err, result) => {
    res.send(result);
  });
});


app.post("/class", (req, res) => {
  var LEADER_NAME = req.body.LEADER_NAME;

  const sqlQuery = 
    "SELECT LEADER_CLASS FROM LEADER_TBL WHERE LEADER_NAME = ?;";
  db.query(sqlQuery, [LEADER_NAME], (err, result) => {
    res.send(result);
  });
});

app.post("/auction", (req, res) => {
  var LEADER_CLASS = req.body.LEADER_CLASS;
  const sqlQuery = 
    "SELECT LEADER_NAME, LEADER_TEAM, LEADER_GRADE, leader_class FROM LEADER_TBL";
  db.query(sqlQuery, [leader_class], (err, result) => {
    res.send(result);
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('App is listening on port ' + listener.address().port)
})



