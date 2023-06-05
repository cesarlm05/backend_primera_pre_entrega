// Importar los módulos necesarios
import express from "express";
import productRouter from "./routers/product.router.js";
import cartRouter from "./routers/cart.router.js";

// Crear la aplicación Express
const app = express();

// Configurar el puerto
const PORT = 8080;

// Configurar middleware para procesar el cuerpo de las solicitudes
app.use(express.json());

// Configurar los routers
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});