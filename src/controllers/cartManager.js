import fs from "fs/promises";
import ProductManager from "./productManager.js";

class CartManager {
  constructor() {
    this.cartFilePath = "src/models/carrito.json";
    this.productManager = new ProductManager();
  }

  async createCart(newCart) {
    const cartsData = await this.readDataFromFile();
    const generatedId = this.generateCartId(cartsData.carts);
    const cartWithId = { ...newCart, id: generatedId };
    cartsData.carts.push(cartWithId);
    await this.saveDataToFile(cartsData);
    return cartWithId;
  }

  async getCartById(cartId) {
    const cartsData = await this.readDataFromFile();
    const cart = cartsData.carts.find((cart) => cart.id === cartId);
    if (cart) {
      const products = await this.mapProductsWithDetails(cart.products);
      return { ...cart, products };
    }
    return null;
  }

  async addProductToCart(cartId, productId, quantity) {
    const cartsData = await this.readDataFromFile();
    const cartIndex = cartsData.carts.findIndex((cart) => cart.id === cartId);
    if (cartIndex !== -1) {
      const cart = cartsData.carts[cartIndex];
      const existingProductIndex = cart.products.findIndex(
        (product) => product.product === productId
      );
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
      await this.saveDataToFile(cartsData);
      const updatedCart = await this.getCartById(cartId);
      return updatedCart;
    }
    return null;
  }

  async readDataFromFile() {
    try {
      const data = await fs.readFile(this.cartFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al leer el archivo: ${this.cartFilePath}`);
      return { carts: [] };
    }
  }

  async saveDataToFile(data) {
    try {
      await fs.writeFile(this.cartFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error al escribir en el archivo: ${this.cartFilePath}`);
    }
  }

  async mapProductsWithDetails(products) {
    const productIds = products.map((product) => product.product);
    const mappedProducts = [];
    for (const productId of productIds) {
      const product = await this.productManager.getProductById(productId);
      if (product) {
        mappedProducts.push({
          product,
          quantity: products.find((p) => p.product === productId).quantity,
        });
      }
    }
    return mappedProducts;
  }

  generateCartId(carts) {
    const existingIds = carts.map((cart) => cart.id);
    let generatedId = "";
    do {
      generatedId = Math.random().toString(36).substr(2, 9);
    } while (existingIds.includes(generatedId));
    return generatedId;
  }
}

export default CartManager;
