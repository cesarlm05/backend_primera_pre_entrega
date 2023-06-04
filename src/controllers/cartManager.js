import fs from "fs/promises";

const CARTS_FILE = "src/models/carrito.json";

// Función que lee la lista de cart
async function readCartList() {
  try {
    const data = await fs.readFile(CARTS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function writeCartList(carts) {
  await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
}

// Genera un nuevo cart ID
function generateCartId() {
  return Math.random().toString(36).substr(2, 9);
}

// Create un nuevo cart
export async function createCart() {
  const carts = await readCartList();
  const newCartId = generateCartId();
  const newCart = { id: newCartId, products: [] };
  carts.push(newCart);
  await writeCartList(carts);
  return newCart;
}

// Obtiene los productos del cart
export async function getCartProducts(cid) {
  const carts = await readCartList();
  const cart = carts.find((c) => c.id === cid);
  return cart ? cart.products : null;
}

// Add un nuevo producto en le cart
export async function addProductToCart(cid, pid, quantity) {
  const carts = await readCartList();
  const cartIndex = carts.findIndex((c) => c.id === cid);
  if (cartIndex !== -1) {
    const cart = carts[cartIndex];
    const existingProductIndex = cart.products.findIndex(
      (p) => p.product === pid
    );
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
