import express from 'express';
import { createCart, getCartProducts, addProductToCart } from '../cartManager.js';

const router = express.Router();

// POST /api/carts/
router.post('/', async (req, res) => {
  const cart = await createCart();
  res.json(cart);
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cartProducts = await getCartProducts(cid);
  if (cartProducts) {
    res.json(cartProducts);
  } else {
    res.status(404).json({ error: 'Cart not found' });
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const addedProduct = await addProductToCart(cid, pid, quantity);
  if (addedProduct) {
    res.json(addedProduct);
  } else {
    res.status(404).json({ error: 'Cart or product not found' });
  }
});

export default router;
