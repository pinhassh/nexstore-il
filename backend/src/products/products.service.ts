import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';
import { seedProducts } from './products.seed';
import { CreateProductDto, ProductQueryDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  private products: Product[] = [...seedProducts];
  private nextId = seedProducts.length + 1;

  findAll(query: ProductQueryDto): Product[] {
    let result = [...this.products];

    if (query.minPrice !== undefined) {
      result = result.filter((p) => p.price >= query.minPrice);
    }
    if (query.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= query.maxPrice);
    }
    if (query.category) {
      result = result.filter(
        (p) => p.category.toLowerCase() === query.category.toLowerCase(),
      );
    }
    if (query.search) {
      const term = query.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }
    if (query.inStockOnly) {
      result = result.filter((p) => p.inStock);
    }
    if (query.sortBy) {
      const order = query.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        if (query.sortBy === 'price') return (a.price - b.price) * order;
        return a.name.localeCompare(b.name) * order;
      });
    }

    return result;
  }

  findById(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  create(dto: CreateProductDto): Product {
    const product: Product = { id: this.nextId++, ...dto };
    this.products.push(product);
    return product;
  }
}
