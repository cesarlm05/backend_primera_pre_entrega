import fs from 'fs/promises';

const CARTS_FILE = 'carrito.json';

// Helper function to read the cart list from file
async function readCartList() {
  try {
    const data = await fs.readFile(CARTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write the cart list to file
async function writeCartList(carts) {
  await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
}

// Generate a new cart ID
function generateCartId() {
  return Math.random().toString(36).substr(2, 9);
}

// Create a new cart
export async function createCart() {
  const carts = await readCartList();
  const newCartId = generateCartId();
  const newCart = { id: newCartId, products: [] };
  carts.push(newCart);
  await writeCartList(carts);
  return newCart;
}

// Get the products of a cart
export async function getCartProducts(cid) {
  const carts = await readCartList();
  const cart = carts.find(c => c.id === cid);
  return cart ? cart.products : null;
}

// Add a product to a cart
export async function addProductToCart(cid, pid, quantity) {
  const carts = await readCartList();
  const cartIndex = carts.findIndex(c => c.id === cid);
  if (cartIndex !== -1) {
    const cart = carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(p => p.product === pid);
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ product: pid, quantity });
    }
    await writeCartList(carts);
    return cart.products;
  } else {
    return null;
  }
}
