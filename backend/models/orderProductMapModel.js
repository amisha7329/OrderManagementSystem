module.exports = (sequelize, DataTypes) => {
const OrderProductMapModel = sequelize.define("OrderProductMap", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderId: {
        type: DataTypes.INTEGER,
        field: "orderId",
        allowNull: false,
        references: {
            model: "orders",
            key: "id"
        }
    },
    productId: {
        type: DataTypes.INTEGER,
        field: "productId",
        allowNull: false,
        references: {
            model: "products",
            key: "id"
        }
    }

},
{
    tableName: "orderproductmap",
    timestamps: false,
  }
);

return OrderProductMapModel;
};