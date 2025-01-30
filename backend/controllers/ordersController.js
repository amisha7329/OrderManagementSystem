const { Sequelize } = require("sequelize");
const {Order, OrderProductMap, Product, sequelize} = require("../models");
const { addProductQuantities } = require("../utils/productQuantityUtils");

exports.getAllOrders = async (req, res) => {
    try {
        const result = await Order.findAll({
            include: [
                {
                    model: Product,
                    through: { attributes: [] }, // Exclude join table attributes
                },
            ],
        });

        
        const updatedOrders = await Promise.all(
            result.map((order) => addProductQuantities(order))
        );


        console.log("Final Result:", updatedOrders);
        res.status(200).json(updatedOrders);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.getOrderById = async(req,res) => {
    try {
        const {id} = req.params;
        const result = await Order.findOne({
            where: {id},
            include: {
                model: Product,
                through:{attributes:[]}, //excluding join table attributes
            }
        });
        if(!result) {
            return res.status(400).json("Order Not Found");
        }
        // const updatedOrders = await Promise.all(
        //     result.map((order) => addProductQuantities(order))
        // );
        const updatedOrder = await addProductQuantities(result); //using the utility function
        res.status(200).json(updatedOrder);
    } catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.addNewOrder = async(req, res) => {
    try {
        const {orderDescription, productIds} = req.body;
        const newOrder = await Order.create({orderDescription});
        // console.log("new order", newOrder)
        // console.log("new orderID", newOrder.id)

        //Associate products
        if(productIds && productIds.length>0){
            const mappings = productIds.map(productId => ({
                orderId: newOrder.id,
                productId: productId
            }))
// console.log("new order mappings", mappings)
            await OrderProductMap.bulkCreate(mappings)
        }
        // console.log("Added New order", newOrder);
        res.status(201).json(newOrder);
    } catch(err) {
        res.status(500).json({err: err.message});
    }
}

exports.updateOrderById = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { orderDescription, productIds } = req.body;

        let updateCount = 0;

        // update orderDescription if provided
        if (orderDescription) {
            [updateCount] = await Order.update(
                { orderDescription },
                { where: { id }, returning: true, transaction }
            );

            if (updateCount === 0) {
                await transaction.rollback();
                return res.status(404).json("Order not found");
            }
        } else {
            // check if order exists if no orderDescription is provided
            const orderExists = await Order.findOne({ where: { id }, transaction });
            if (!orderExists) {
                await transaction.rollback();
                return res.status(404).json("Order not found");
            }
        }

        // update associated products if productIds are provided if not mappings remain unchanged
        if (productIds && productIds.length > 0) {
            // delete existing mappings for the order
            await OrderProductMap.destroy({ where: { orderId: id }, transaction });

            // create new mappings
            const mappings = productIds.map((productId) => ({
                orderId: id,
                productId,
            }));
            await OrderProductMap.bulkCreate(mappings, { transaction });
        }

        // fetch updated order with associated products
        const result = await Order.findOne({
            where: { id },
            include: {
                model: Product,
                through: { attributes: [] }, // Exclude join table attributes
            },
            transaction,
        });

        await transaction.commit();
        return res.status(200).json(result);
    } catch (err) {
        await transaction.rollback();
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteOrderById = async(req, res) => {
    try {
        const {id} = req.params;

        //delete mappings first, then the order
        await OrderProductMap.destroy({where: {orderId: id}});
        const result = await Order.destroy({where: {id}});

        if(!result) {
            return res.status(404).json("Order not found");
        }
        res.status(200).json("Order deleted successfully")
    } catch(err){
        res.status(500).json({error: err.message});
    }
};
