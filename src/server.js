// server.js
import express from "express";
import productsRouter from "./routers/product.router.js";
import cartsRouter from "./routers/cart.router.js";

const app = express();
const PORT = 8080;

// Parse JSON
app.use(express.json());

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
