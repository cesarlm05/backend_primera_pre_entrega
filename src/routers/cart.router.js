import express from 'express';
import { createCart, getCartProducts, addProductToCart } from '../cartManager.js';

const router = express.Router();

// POST /api/carts/
router.post('/', (req, res) => {
  const cart = createCart();
  res.json(cart);
});

// GET /api/carts/:cid
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const cartProducts = getCartProducts(cid);
  if (cartProducts) {
    res.json(cartProducts);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const addedProduct = addProductToCart(cid, pid, quantity);
  if (addedProduct) {
    res.json(addedProduct);
  } else {
    res.status(404).json({ error: 'Cart or product not found' });
  }
});

export default router;
