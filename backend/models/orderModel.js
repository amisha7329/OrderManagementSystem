module.exports = (sequelize, DataTypes) => {
    const OrderModel = sequelize.define("Order", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        orderDescription: {
            type: DataTypes.STRING,
            field: "orderDescription",
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            field: "createdAt",
            defaultValue: DataTypes.NOW,
        },
    },
    {
        tableName: "orders",
        timestamps: false,
      }
);

    return OrderModel;
};
