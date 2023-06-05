import express from "express";
import multer from "multer";
import ProductManager from "../controllers/productManager.js";

const productManager = new ProductManager();

// Crear el router de Express
const router = express.Router();

// Configurar el middleware de Multer para el manejo de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directorio donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Ruta raíz GET /api/products/
router.get("/", async (req, res) => {
  const products = await productManager.getAllProducts();
  res.json(products);
});

// Ruta GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const product = await productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Ruta raíz POST /api/products/
router.post("/", upload.array("thumbnails", 5), async (req, res) => {
  const { title, description, code, price, stock, category } = req.body;
  const thumbnails = req.files.map((file) => file.path);
  const newProduct = {
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };
  const createdProduct = await productManager.addProduct(newProduct);
  res.status(201).json(createdProduct);
});

// Ruta PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const updatedProduct = req.body;
  const product = await productManager.updateProduct(productId, updatedProduct);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Ruta DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const deletedProduct = await productManager.deleteProduct(productId);
  if (deletedProduct) {
    res.json({ message: "Producto eliminado exitosamente" });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

export default router;
