import products from "./data/products";
import { recommendProducts } from "./matcher";

export function getRecommendations(user) {
  return recommendProducts(user, products);
}