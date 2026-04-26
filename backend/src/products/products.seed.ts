import { Product } from './product.entity';

export const seedProducts: Product[] = [
  // Electronics
  { id: 1, name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with 30hr battery and active noise cancellation.', price: 299.99, category: 'Electronics', inStock: true, imageUrl: 'https://picsum.photos/seed/prod1/400/400' },
  { id: 2, name: '4K Smart TV 55"', description: 'Ultra HD OLED display with HDR10+ and built-in streaming apps.', price: 899.99, category: 'Electronics', inStock: true, imageUrl: 'https://picsum.photos/seed/prod2/400/400' },
  { id: 3, name: 'Mechanical Keyboard', description: 'Compact TKL layout with Cherry MX Red switches and RGB backlight.', price: 129.99, category: 'Electronics', inStock: true, imageUrl: 'https://picsum.photos/seed/prod3/400/400' },
  { id: 4, name: 'Gaming Mouse', description: 'Ergonomic wired mouse with 16000 DPI sensor and programmable buttons.', price: 59.99, category: 'Electronics', inStock: true, imageUrl: 'https://picsum.photos/seed/prod4/400/400' },
  { id: 5, name: 'USB-C Laptop Stand', description: 'Adjustable aluminum stand with integrated USB-C hub and 4K passthrough.', price: 79.99, category: 'Electronics', inStock: false, imageUrl: 'https://picsum.photos/seed/prod5/400/400' },
  { id: 6, name: 'Portable Bluetooth Speaker', description: 'Waterproof IPX7 speaker with 360° sound and 20hr playtime.', price: 89.99, category: 'Electronics', inStock: true, imageUrl: 'https://picsum.photos/seed/prod6/400/400' },
  { id: 7, name: 'Smartwatch Series X', description: 'Health-tracking smartwatch with GPS, ECG, SpO2 monitor and 7-day battery.', price: 349.99, category: 'Electronics', inStock: true, imageUrl: 'https://picsum.photos/seed/prod7/400/400' },

  // Clothing
  { id: 8, name: 'Classic Denim Jacket', description: 'Timeless medium-wash denim jacket with button closure and chest pockets.', price: 89.99, category: 'Clothing', inStock: true, imageUrl: 'https://picsum.photos/seed/prod8/400/400' },
  { id: 9, name: 'Merino Wool Sweater', description: 'Lightweight crewneck sweater in 100% merino wool, machine washable.', price: 119.99, category: 'Clothing', inStock: true, imageUrl: 'https://picsum.photos/seed/prod9/400/400' },
  { id: 10, name: 'Running Shorts', description: 'Quick-dry 5" inseam shorts with built-in liner and reflective details.', price: 34.99, category: 'Clothing', inStock: true, imageUrl: 'https://picsum.photos/seed/prod10/400/400' },
  { id: 11, name: 'Waterproof Hiking Jacket', description: 'Shell jacket with Gore-Tex membrane, pit zips, and helmet-compatible hood.', price: 199.99, category: 'Clothing', inStock: false, imageUrl: 'https://picsum.photos/seed/prod11/400/400' },
  { id: 12, name: 'Slim Fit Chinos', description: 'Stretch cotton chinos available in 12 colors with a modern tapered cut.', price: 64.99, category: 'Clothing', inStock: true, imageUrl: 'https://picsum.photos/seed/prod12/400/400' },

  // Books
  { id: 13, name: 'Clean Code', description: 'A handbook of agile software craftsmanship by Robert C. Martin.', price: 39.99, category: 'Books', inStock: true, imageUrl: 'https://picsum.photos/seed/prod13/400/400' },
  { id: 14, name: 'The Pragmatic Programmer', description: '20th anniversary edition — your journey to mastery by Hunt & Thomas.', price: 44.99, category: 'Books', inStock: true, imageUrl: 'https://picsum.photos/seed/prod14/400/400' },
  { id: 15, name: 'Designing Data-Intensive Applications', description: 'The big ideas behind reliable, scalable, and maintainable systems.', price: 49.99, category: 'Books', inStock: true, imageUrl: 'https://picsum.photos/seed/prod15/400/400' },
  { id: 16, name: 'Atomic Habits', description: 'An easy and proven way to build good habits and break bad ones.', price: 18.99, category: 'Books', inStock: true, imageUrl: 'https://picsum.photos/seed/prod16/400/400' },

  // Home & Kitchen
  { id: 17, name: 'Pour-Over Coffee Set', description: 'Hand-blown glass dripper with stainless steel filter and wooden collar.', price: 54.99, category: 'Home & Kitchen', inStock: true, imageUrl: 'https://picsum.photos/seed/prod17/400/400' },
  { id: 18, name: 'Cast Iron Skillet 12"', description: 'Pre-seasoned cast iron skillet ideal for searing, baking, and grilling.', price: 44.99, category: 'Home & Kitchen', inStock: true, imageUrl: 'https://picsum.photos/seed/prod18/400/400' },
  { id: 19, name: 'Bamboo Cutting Board Set', description: 'Set of 3 organic bamboo boards with juice grooves and non-slip feet.', price: 32.99, category: 'Home & Kitchen', inStock: true, imageUrl: 'https://picsum.photos/seed/prod19/400/400' },
  { id: 20, name: 'Cold Brew Coffee Maker', description: '1-liter borosilicate glass cold brew carafe with fine-mesh stainless filter.', price: 39.99, category: 'Home & Kitchen', inStock: false, imageUrl: 'https://picsum.photos/seed/prod20/400/400' },
  { id: 21, name: 'Knife Set 8-Piece', description: 'High-carbon German steel knives with full tang and ergonomic handles.', price: 149.99, category: 'Home & Kitchen', inStock: true, imageUrl: 'https://picsum.photos/seed/prod21/400/400' },

  // Sports & Outdoors
  { id: 22, name: 'Yoga Mat Pro', description: 'Non-slip 6mm thick mat with alignment lines, carrying strap included.', price: 69.99, category: 'Sports', inStock: true, imageUrl: 'https://picsum.photos/seed/prod22/400/400' },
  { id: 23, name: 'Adjustable Dumbbells 5-52.5 lbs', description: 'Space-saving adjustable dumbbells with click-dial weight selection.', price: 399.99, category: 'Sports', inStock: true, imageUrl: 'https://picsum.photos/seed/prod23/400/400' },
  { id: 24, name: 'Foam Roller', description: 'High-density 36" foam roller for deep-tissue muscle recovery and mobility.', price: 24.99, category: 'Sports', inStock: true, imageUrl: 'https://picsum.photos/seed/prod24/400/400' },
  { id: 25, name: 'Trail Running Shoes', description: 'Lightweight trail shoes with rock plate and Vibram Megagrip outsole.', price: 149.99, category: 'Sports', inStock: true, imageUrl: 'https://picsum.photos/seed/prod25/400/400' },

  // Beauty & Personal Care
  { id: 26, name: 'Vitamin C Serum 30ml', description: 'Brightening serum with 15% L-ascorbic acid, ferulic acid, and vitamin E.', price: 29.99, category: 'Beauty', inStock: true, imageUrl: 'https://picsum.photos/seed/prod26/400/400' },
  { id: 27, name: 'Electric Toothbrush', description: 'Sonic toothbrush with 3 modes, pressure sensor, and 2-minute timer.', price: 79.99, category: 'Beauty', inStock: true, imageUrl: 'https://picsum.photos/seed/prod27/400/400' },
  { id: 28, name: 'SPF 50 Sunscreen 100ml', description: 'Lightweight daily sunscreen with UVA/UVB protection, fragrance-free.', price: 19.99, category: 'Beauty', inStock: false, imageUrl: 'https://picsum.photos/seed/prod28/400/400' },

  // Toys & Games
  { id: 29, name: 'Strategy Board Game', description: 'Award-winning resource management game for 2-4 players, ages 10+.', price: 44.99, category: 'Toys & Games', inStock: true, imageUrl: 'https://picsum.photos/seed/prod29/400/400' },
  { id: 30, name: 'LEGO Architecture Set', description: '1600-piece modular architecture set. Great display piece for adults.', price: 89.99, category: 'Toys & Games', inStock: true, imageUrl: 'https://picsum.photos/seed/prod30/400/400' },
];
