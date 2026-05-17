const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, size, minPrice, maxPrice, sort, search, featured, inStock } = req.query;
    const filter = {};

    if (category)           filter.category = { $regex: category, $options: 'i' };
    if (size)               filter.sizes    = size;
    if (featured === 'true') filter.featured = true;
    if (inStock === 'true') filter.stock    = { $gt: 0 };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category:    { $regex: search, $options: 'i' } },
      ];
    }

    let query = Product.find(filter);

    if (sort === 'price_asc')  query = query.sort({ price:  1 });
    if (sort === 'price_desc') query = query.sort({ price: -1 });
    if (sort === 'latest')     query = query.sort({ createdAt: -1 });

    const products = await query;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/products  (admin)
// Images are sent as an array of URLs in req.body.images
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, variants, stock, featured, images } = req.body;

    const product = await Product.create({
      name,
      description:  description || '',
      price:        Number(price),
      category:     category.toLowerCase(),
      sizes:        Array.isArray(sizes)    ? sizes    : (sizes    ? sizes.split(',').map((s) => s.trim()).filter(Boolean)    : []),
      variants:     Array.isArray(variants) ? variants : (variants ? variants.split(',').map((v) => v.trim()).filter(Boolean) : []),
      stock:        Number(stock),
      images:       Array.isArray(images)   ? images   : (images   ? images.split(',').map((i) => i.trim()).filter(Boolean)   : []),
      featured:     featured === true || featured === 'true',
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/products/:id  (admin)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, sizes, variants, stock, featured, images } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name        !== undefined) product.name        = name;
    if (description !== undefined) product.description = description;
    if (price       !== undefined) product.price       = Number(price);
    if (category    !== undefined) product.category    = category.toLowerCase();
    if (stock       !== undefined) product.stock       = Number(stock);
    if (featured    !== undefined) product.featured    = featured === true || featured === 'true';

    if (sizes !== undefined)
      product.sizes    = Array.isArray(sizes)    ? sizes    : sizes.split(',').map((s) => s.trim()).filter(Boolean);
    if (variants !== undefined)
      product.variants = Array.isArray(variants) ? variants : variants.split(',').map((v) => v.trim()).filter(Boolean);
    if (images !== undefined)
      product.images   = Array.isArray(images)   ? images   : images.split(',').map((i) => i.trim()).filter(Boolean);

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/products/:id  (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
