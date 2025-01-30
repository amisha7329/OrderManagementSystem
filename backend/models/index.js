const { Sequelize } = require("sequelize");
const config = require("../dbConfig/config.json")["development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    // logging: false,
  }
);

const Order = require("./orderModel")(sequelize, Sequelize.DataTypes);
const Product = require("./productModel")(sequelize, Sequelize.DataTypes);
const OrderProductMap = require("./orderProductMapModel")(sequelize, Sequelize.DataTypes);

//Relationships between Tables
Order.belongsToMany(Product, {through: OrderProductMap, foreignKey: "orderId"});
Product.belongsToMany(Order, {through: OrderProductMap, foreignKey: "productId"});

const db = {
    sequelize,
    Sequelize,
    Order,
    Product,
    OrderProductMap
};

module.exports = db;
