// const { Sequelize } = require("sequelize");
// const { OrderProductMap } = require("../models");

// // add product quantity in an order
// const addProductQuantities = async (order) => {
//     console.log("Order Data:", order);

//     // count of product quantity
//     const productQuantities = await OrderProductMap.findAll({
//         where: { orderId: order.id },
//         attributes: [
//             "productId",
//             [Sequelize.fn("COUNT", Sequelize.col("productId")), "quantity"],
//         ],
//         group: ["productId"],
//         raw: true,
//     });

//     // map productId: quantity
//     const quantityMap = productQuantities.reduce((map, item) => {
//         map[item.productId] = parseInt(item.quantity, 10);
//         return map;
//     }, {});

//     // add quantity to each product
//     order.Products = order.Products.map((product) => ({
//         ...product.toJSON(),
//         quantity: quantityMap[product.id] || 0,
//     }));

//     return order;
// };

// module.exports = { addProductQuantities };


const { Sequelize } = require("sequelize");
const { OrderProductMap } = require("../models");

const addProductQuantities = async (order) => {
   
    const plainOrder = order.toJSON();


    // fetch product quantities for this order
    const productQuantities = await OrderProductMap.findAll({
        where: { orderId: order.id },
        attributes: [
            "productId",
            [Sequelize.fn("COUNT", Sequelize.col("productId")), "quantity"],
        ],
        group: ["productId"],
        raw: true,
    });

    // console.log("Product Quantities:", productQuantities);

    // map productId to quantity
    const quantityMap = productQuantities.reduce((map, item) => {
        map[item.productId] = parseInt(item.quantity, 10);
        return map;
    }, {});

    // console.log("Quantity Map:", quantityMap);

    // add quantity to each product
    plainOrder.Products = plainOrder.Products.map((product) => ({
        ...product,
        quantity: quantityMap[product.id] || 0,
    }));

    // console.log("Updated Order Products:", plainOrder.Products);

    return plainOrder;
};

module.exports = { addProductQuantities };
