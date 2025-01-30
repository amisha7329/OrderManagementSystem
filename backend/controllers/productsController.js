const {Product} = require("../models");

exports.getAllProducts = async (req, res) => {
  try {
    const result = await Product.findAll();
    // console.log("resultProduct", result);
    res.status(200).json(result);
  } catch (error) {
    console.log("error", err);
    res.status(500).json({ error: error });
  }
};
