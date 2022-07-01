const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "company",
  },
  console.log("Welcome to Employee Manager!")
);

module.exports = db;
