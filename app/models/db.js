//const mysql = require("mysql");
const pg = require("pg");
const Sequelize = require('sequelize');

require('dotenv').config()
//Sequelize connection
var connection = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.HOST,
    port: 5432,
    dialect: 'postgres'
  });
  module.exports = connection;