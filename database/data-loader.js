const axios = require('axios');
const fs = require('fs');

async function loadDataFromDummyJSON() {
  try {
    // Fetch categories from DummyJSON
    const categoriesResponse = await axios.get('https://dummyjson.com/products/categories');
    const categories = categoriesResponse.data.map((cat, index) => {
      const categoryName = typeof cat === 'string' ? cat : cat.name || cat.slug;
      return {
        id: index + 1,
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace('-', ' '),
        description: `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1).replace('-', ' ')} products`,
        is_active: true,
        created_at: new Date()
      };
    });

    // Fetch products from DummyJSON
    const productsResponse = await axios.get('https://dummyjson.com/products?limit=100');
    const products = productsResponse.data.products.map(product => {
      const categoryIndex = categories.findIndex(cat => 
        cat.name.toLowerCase().includes(product.category.toLowerCase()) ||
        product.category.toLowerCase().includes(cat.name.toLowerCase())
      );
      
      return {
        id: product.id,
        name: product.title,
        description: product.description,
        price: product.price,
        category_id: categoryIndex >= 0 ? categories[categoryIndex].id : 1,
        brand: product.brand || 'Generic',
        sku: `SKU-${product.id}`,
        stock_quantity: product.stock,
        rating: product.rating,
        discount_percentage: product.discountPercentage,
        image_url: product.thumbnail,
        images: product.images,
        is_active: true,
        availability_status: product.stock > 0 ? 'In Stock' : 'Out of Stock',
        created_at: new Date(),
        updated_at: new Date()
      };
    });

    // Save to JSON files
    fs.writeFileSync('data/categories.json', JSON.stringify(categories, null, 2));
    fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2));
    
    console.log(`Loaded ${categories.length} categories and ${products.length} products`);
    console.log('Data saved to JSON files');
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

loadDataFromDummyJSON();