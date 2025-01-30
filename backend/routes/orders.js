const express = require("express");
const ordersController = require("../controllers/ordersController");

const ordersRoute = express.Router();

ordersRoute.get("/", ordersController.getAllOrders);
ordersRoute.get("/:id", ordersController.getOrderById);
ordersRoute.post("/", ordersController.addNewOrder);
ordersRoute.put("/:id", ordersController.updateOrderById);
ordersRoute.delete("/:id", ordersController.deleteOrderById);

module.exports = ordersRoute;