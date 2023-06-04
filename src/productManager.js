import fs from 'fs/promises';

const PRODUCTS_FILE = 'productos.json';

// Helper function to read the product list from file
async function readProductList() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write the product list to file
async function writeProductList(products) {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

// Get the list of products
export async function getProductList() {
  const products = await readProductList();
  return products;
}

// Get a product by ID
export async function getProductById(pid) {
  const products = await readProductList();
  return products.find(product => product.id === pid);
}

// Add a new product
export async function addProduct(product) {
  const products = await readProductList();
  const newProductId = Math.max(...products.map(p => p.id), 0) + 1;
  const newProduct = { id: newProductId.toString(), ...product };
  products.push(newProduct);
  await writeProductList(products);
  return newProduct;
}

// Update a product
export async function updateProduct(pid, updatedFields) {
  const products = await readProductList();
  const productIndex = products.findIndex(product => product.id === pid);
  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...updatedFields };
    products[productIndex] = updatedProduct;
    await writeProductList(products);
    return updatedProduct;
  } else {
    return null;
  }
}

// Delete a product
export async function deleteProduct(pid) {
  const products = await readProductList();
  const productIndex = products.findIndex(product => product.id === pid);
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1)[0];
    await writeProductList(products);
    return deletedProduct;
  } else {
    return null;
  }
}
