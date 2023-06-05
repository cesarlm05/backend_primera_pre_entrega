import fs from "fs/promises";

class ProductManager {
  constructor() {
    this.productsFilePath = "src/models/productos.json";
  }

  async getAllProducts() {
    const productsData = await this.readDataFromFile();
    return productsData.products;
  }

  async getProductById(productId) {
    const productsData = await this.readDataFromFile();
    return productsData.products.find((product) => product.id === productId);
  }

  async addProduct(newProduct) {
    const productsData = await this.readDataFromFile();
    const generatedId = this.generateProductId(productsData.products);
    const productWithId = { ...newProduct, id: generatedId };
    productsData.products.push(productWithId);
    await this.saveDataToFile(productsData);
    return productWithId;
  }

  async updateProduct(productId, updatedProduct) {
    const productsData = await this.readDataFromFile();
    const productIndex = productsData.products.findIndex(
      (product) => product.id === productId
    );
    if (productIndex !== -1) {
      productsData.products[productIndex] = {
        ...productsData.products[productIndex],
        ...updatedProduct,
      };
      await this.saveDataToFile(productsData);
      return productsData.products[productIndex];
    }
    return null;
  }

  async deleteProduct(productId) {
    const productsData = await this.readDataFromFile();
    const productIndex = productsData.products.findIndex(
      (product) => product.id === productId
    );
    if (productIndex !== -1) {
      const deletedProduct = productsData.products.splice(productIndex, 1);
      await this.saveDataToFile(productsData);
      return deletedProduct[0];
    }
    return null;
  }

  async readDataFromFile() {
    try {
      const data = await fs.readFile(this.productsFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error al leer el archivo: ${this.productsFilePath}`);
      return { products: [] };
    }
  }

  async saveDataToFile(data) {
    try {
      await fs.writeFile(this.productsFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(
        `Error al escribir en el archivo: ${this.productsFilePath}`
      );
    }
  }

  generateProductId(products) {
    const existingIds = products.map((product) => product.id);
    let generatedId = "";
    do {
      generatedId = Math.random().toString(36).substr(2, 9);
    } while (existingIds.includes(generatedId));
    return generatedId;
  }
}

export default ProductManager;
