import express from "express";
import multer from "multer";
import {
  getProductList,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productManager.js";

const router = express.Router();

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });

// GET /api/products/
router.get("/", async (req, res) => {
  const productList = await getProductList();
  res.json(productList);
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  const product = await getProductById(pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// POST /api/products/
router.post("/", upload.array("thumbnails"), async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
  } = req.body;
  const thumbnails = req.files.map((file) => file.path);
  const product = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  };
  const addedProduct = await addProduct(product);
  res.json(addedProduct);
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedFields = req.body;
  const updatedProduct = await updateProduct(pid, updatedFields);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await deleteProduct(pid);
  if (deletedProduct) {
    res.json(deletedProduct);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

export default router;
