import express from 'express';
import fs from 'fs';

const app = express();
const PORT = 8080;

// Middleware para el manejo de JSON en las solicitudes
app.use(express.json());

// Rutas para el manejo de productos
const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
  // Obtener todos los productos de la base
  const products = JSON.parse(fs.readFileSync('productos.json'));
  res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
  // Obtener el producto con el id proporcionado
  const productId = req.params.pid;
  const products = JSON.parse(fs.readFileSync('productos.json'));
  const product = products.find((p) => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productsRouter.post('/', (req, res) => {
  // Agregar un nuevo producto
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  // Generar el id del producto
  const products = JSON.parse(fs.readFileSync('productos.json'));
  const lastProduct = products[products.length - 1];
  const id = lastProduct ? lastProduct.id + 1 : 1;

  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);
  fs.writeFileSync('productos.json', JSON.stringify(products));

  res.status(201).json(newProduct);
});

productsRouter.put('/:pid', (req, res) => {
  // Actualizar un producto existente
  const productId = req.params.pid;
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  const products = JSON.parse(fs.readFileSync('productos.json'));
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex !== -1) {
    const updatedProduct = {
      ...products[productIndex],
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
    };

    products[productIndex] = updatedProduct;
    fs.writeFileSync('productos.json', JSON.stringify(products));

    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productsRouter.delete('/:pid', (req, res) => {
  // Eliminar un producto
  const productId = req.params.pid;

  const products = JSON.parse(fs.readFileSync('productos.json'));
  const filteredProducts = products.filter((p) => p.id !== productId);

  if (filteredProducts.length !== products.length) {
    fs.writeFileSync('productos.json', JSON.stringify(filteredProducts));
    res.sendStatus(204);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.use('/api/products', productsRouter);

// Rutas para el manejo de carritos
const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
  // Crear un nuevo carrito
  const { products } = req.body;

  // Generar el id del carrito
  const carts = JSON.parse(fs.readFileSync('carrito.json'));
  const lastCart = carts[carts.length - 1];
  const id = lastCart ? lastCart.id + 1 : 1;

  const newCart = {
    id,
    products: products || [],
  };

  carts.push(newCart);
  fs.writeFileSync('carrito.json', JSON.stringify(carts));

  res.status(201).json(newCart);
});

cartsRouter.get('/:cid', (req, res) => {
  // Obtener los productos de un carrito
  const cartId = req.params.cid;
  const carts = JSON.parse(fs.readFileSync('carrito.json'));
  const cart = carts.find((c) => c.id === cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  // Agregar un producto a un carrito
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const carts = JSON.parse(fs.readFileSync('carrito.json'));
  const cartIndex = carts.findIndex((c) => c.id === cartId);

  if (cartIndex !== -1) {
    const productIndex = carts[cartIndex].products.findIndex((p) => p.product === productId);

    if (productIndex !== -1) {
      // El producto ya existe en el carrito, incrementar la cantidad
      carts[cartIndex].products[productIndex].quantity++;
    } else {
      // Agregar el producto al carrito
      carts[cartIndex].products.push({ product: productId, quantity: 1 });
    }

    fs.writeFileSync('carrito.json', JSON.stringify(carts));
    res.json(carts[cartIndex]);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

app.use('/api/carts', cartsRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
