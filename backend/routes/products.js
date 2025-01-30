const express = require("express");
const productsController = require("../controllers/productsController");

const productsRoute = express.Router();

productsRoute.get('/', productsController.getAllProducts);

module.exports = productsRoute;