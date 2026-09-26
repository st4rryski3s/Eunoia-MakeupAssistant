const products = require("../data/products");
const { recommendProducts } = require("./matcher");

function getRecommendations(user) {
  return recommendProducts(user, products);
}

module.exports = {
  getRecommendations,
};