require("dotenv").config();
const { Sequelize } = require("sequelize");

const config = require("../dbConfig/config")["development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const Order = require("./orderModel")(sequelize, Sequelize.DataTypes);
const Product = require("./productModel")(sequelize, Sequelize.DataTypes);
const OrderProductMap = require("./orderProductMapModel")(
  sequelize,
  Sequelize.DataTypes
);

// Define Relationships
Order.belongsToMany(Product, {
  through: OrderProductMap,
  foreignKey: "orderId",
});
Product.belongsToMany(Order, {
  through: OrderProductMap,
  foreignKey: "productId",
});

const db = {
  sequelize,
  Sequelize,
  Order,
  Product,
  OrderProductMap,
};

sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced and tables created successfully!");
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
  });

module.exports = db;
