import fs from "fs/promises";

const PRODUCTS_FILE = "productos.json";

// función para leer la lista de productos
async function readProductList() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// función para guardar en la lista de productos
async function writeProductList(products) {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Obtiene la lista de productos
export async function getProductList() {
  const products = await readProductList();
  return products;
}

// Obtiene un producto de la lista por ID
export async function getProductById(pid) {
  const products = await readProductList();
  return products.find((product) => product.id === pid);
}

// Add un nuevo producto
export async function addProduct(product) {
  const products = await readProductList();
  const newProductId = Math.max(...products.map((p) => p.id), 0) + 1;
  const newProduct = { id: newProductId.toString(), ...product };
  products.push(newProduct);
  await writeProductList(products);
  return newProduct;
}

// Update un producto
export async function updateProduct(pid, updatedFields) {
  const products = await readProductList();
  const productIndex = products.findIndex((product) => product.id === pid);
  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...updatedFields };
    products[productIndex] = updatedProduct;
    await writeProductList(products);
    return updatedProduct;
  } else {
    return null;
  }
}

// Delete un producto
export async function deleteProduct(pid) {
  const products = await readProductList();
  const productIndex = products.findIndex((product) => product.id === pid);
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1)[0];
    await writeProductList(products);
    return deletedProduct;
  } else {
    return null;
  }
}
