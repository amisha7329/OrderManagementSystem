module.exports = (sequelize, DataTypes) => {
  const ProductModel = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      productName: {
        type: DataTypes.STRING,
        field: "productName",
        allowNull: false,
      },
      productDescription: {
        type: DataTypes.TEXT,
        field: "productDescription",
      },
    },
    {
      tableName: "products",
      timestamps: false,
    }
  );

  return ProductModel;
};
