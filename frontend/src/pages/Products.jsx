import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Footwear', 'Jackets', 'Accessories'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PRODUCTS = [
  {
    _id: '1',
    name: 'StrideX Dry-Fit Training Tee',
    description: 'Breathable dry-fit t-shirt engineered for high-intensity workouts.',
    price: 999,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&auto=format'],
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 50,
    featured: true,
  },
  {
    _id: '2',
    name: 'StrideX Elite Hoodie',
    description: 'Heavyweight fleece hoodie with kangaroo pocket and athletic fit.',
    price: 2999,
    images: ['https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600&auto=format'],
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 22,
    featured: true,
  },
  {
    _id: '3',
    name: 'StrideX Muscle Tank',
    description: 'Cut-off muscle tank with racerback design for unrestricted shoulder movement.',
    price: 799,
    images: ['https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&auto=format'],
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 45,
    featured: false,
  },
  {
    _id: '4',
    name: 'StrideX Seamless Sports Bra',
    description: 'Medium-support seamless sports bra with racerback and removable padding.',
    price: 1099,
    images: ['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format'],
    category: 'Tops',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 25,
    featured: false,
  },
  {
    _id: '5',
    name: 'StrideX Longline Sports Tee',
    description: 'Extended-length sports tee with curved hem and UV-protective fabric.',
    price: 1199,
    images: ['https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&auto=format'],
    category: 'Tops',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 2,
    featured: false,
  },
  {
    _id: '6',
    name: 'StrideX Pro Running Shorts',
    description: 'Lightweight 5-inch running shorts with built-in liner and reflective details.',
    price: 1299,
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=600&auto=format'],
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 35,
    featured: true,
  },
  {
    _id: '7',
    name: 'StrideX Compression Tights',
    description: 'Full-length compression tights with moisture-wicking fabric for training and recovery.',
    price: 1799,
    images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format'],
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 28,
    featured: false,
  },
  {
    _id: '8',
    name: 'StrideX Performance Joggers',
    description: 'Tapered joggers with zip pockets and elastic waistband for all-day comfort.',
    price: 1999,
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format'],
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 30,
    featured: false,
  },
  {
    _id: '9',
    name: 'StrideX Woven Track Pants',
    description: 'Classic woven track pants with side stripes and zip ankle cuffs.',
    price: 1599,
    images: ['https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&auto=format'],
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 4,
    featured: false,
  },
  {
    _id: '10',
    name: 'StrideX Speed Runner Shoes',
    description: 'Ultra-lightweight road running shoes with responsive foam cushioning.',
    price: 5999,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format'],
    category: 'Footwear',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 15,
    featured: true,
  },
  {
    _id: '11',
    name: 'StrideX Cross Trainer Shoes',
    description: 'Versatile cross-training shoes with lateral support for gym and court.',
    price: 4999,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format'],
    category: 'Footwear',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 12,
    featured: false,
  },
  {
    _id: '12',
    name: 'StrideX Trail Runner Shoes',
    description: 'Aggressive-grip trail running shoes with rock plate and waterproof upper.',
    price: 6499,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format'],
    category: 'Footwear',
    sizes: ['6', '7', '8', '9', '10', '11', '12'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 8,
    featured: true,
  },
  {
    _id: '13',
    name: 'StrideX Windbreaker Jacket',
    description: 'Packable windbreaker with water-resistant coating for outdoor runs.',
    price: 3499,
    images: ['https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&auto=format'],
    category: 'Jackets',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 10,
    featured: false,
  },
  {
    _id: '14',
    name: 'StrideX Zip-Up Track Jacket',
    description: 'Full-zip track jacket with contrast side panels and ribbed cuffs.',
    price: 2799,
    images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&auto=format'],
    category: 'Jackets',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 17,
    featured: true,
  },
  {
    _id: '15',
    name: 'StrideX Utility Backpack',
    description: 'Durable sports backpack with multiple compartments for gym and travel.',
    price: 2499,
    images: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format'],
    category: 'Accessories',
    sizes: ['Free Size'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 18,
    featured: false,
  },
  {
    _id: '16',
    name: 'StrideX Gym Duffel Bag',
    description: 'Large capacity duffel with ventilated shoe compartment and padded shoulder strap.',
    price: 1999,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format'],
    category: 'Accessories',
    sizes: ['Free Size'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 20,
    featured: false,
  },
  {
    _id: '17',
    name: 'StrideX Pro Snapback Cap',
    description: 'Structured snapback cap with moisture-wicking sweatband and embroidered logo.',
    price: 699,
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format'],
    category: 'Accessories',
    sizes: ['Free Size'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 60,
    featured: false,
  },
  {
    _id: '18',
    name: 'StrideX Grip Training Gloves',
    description: 'Half-finger training gloves with silicone grip palm and wrist wrap support.',
    price: 599,
    images: ['https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&auto=format'],
    category: 'Accessories',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 3,
    featured: false,
  },
  {
    _id: '19',
    name: 'StrideX Cushion Crew Socks',
    description: '3-pack cushioned crew socks with arch support and blister-guard heel.',
    price: 399,
    images: ['https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&auto=format'],
    category: 'Accessories',
    sizes: ['S', 'M', 'L'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 80,
    featured: false,
  },
  {
    _id: '20',
    name: 'StrideX Insulated Water Bottle',
    description: '750ml double-wall insulated stainless steel bottle with leak-proof lid.',
    price: 899,
    images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format'],
    category: 'Accessories',
    sizes: ['Free Size'],
    variants: ['Black', 'Navy', 'Olive'],
    stock: 40,
    featured: false,
  },
];

export default function Products() {
  const [searchParams] = useSearchParams();

  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [size,     setSize]     = useState('');
  const [maxPrice, setMaxPrice] = useState(20000);
  const [sort,     setSort]     = useState('');
  const [inStock,  setInStock]  = useState(false);

  let filtered = PRODUCTS.filter((p) => {
    const matchName     = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    const matchPrice    = p.price <= maxPrice;
    const matchSize     = !size || p.sizes.includes(size);
    const matchStock    = !inStock || p.stock > 0;
    return matchName && matchCategory && matchPrice && matchSize && matchStock;
  });

  if (sort === 'price_asc')  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === 'latest')     filtered = [...filtered].reverse();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-black tracking-tight mb-8">ALL PRODUCTS</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6">

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Category</label>
              <div className="space-y-1">
                {CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      category === c ? 'bg-black text-white font-semibold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >{c}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Size</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button key={s} onClick={() => setSize(size === s ? '' : s)}
                    className={`w-10 h-10 rounded-lg text-xs font-semibold border transition-colors ${
                      size === s ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Max Price: ₹{maxPrice.toLocaleString()}
              </label>
              <input type="range" min={100} max={20000} step={100} value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-black" />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)}
                className="accent-black w-4 h-4" />
              <span className="text-sm text-gray-700">In stock only</span>
            </label>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black">
              <option value="">Sort: Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="latest">Latest</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 font-medium">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}