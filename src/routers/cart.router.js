import express from "express";
import CartManager from "../controllers/cartManager.js";

const cartManager = new CartManager();

// Crear el router de Express
const router = express.Router();

// Ruta raíz POST /api/carts/
router.post("/", async (req, res) => {
  const newCart = {
    products: [],
  };
  const createdCart = await cartManager.createCart(newCart);
  res.status(201).json(createdCart);
});

// Ruta GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const cart = await cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: "Carrito no encontrado" });
  }
});

// Ruta POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;
  const addedProduct = await cartManager.addProductToCart(
    cartId,
    productId,
    quantity
  );
  if (addedProduct) {
    res.json(addedProduct);
  } else {
    res.status(404).json({ error: "Carrito o producto no encontrado" });
  }
});

export default router;
