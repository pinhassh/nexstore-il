import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { seedProducts } from './products.seed';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('returns all 30 seed products when no filters applied', () => {
      const result = service.findAll({});
      expect(result.length).toBe(seedProducts.length);
    });

    it('filters by minPrice', () => {
      const result = service.findAll({ minPrice: 200 });
      result.forEach((p) => expect(p.price).toBeGreaterThanOrEqual(200));
    });

    it('filters by maxPrice', () => {
      const result = service.findAll({ maxPrice: 50 });
      result.forEach((p) => expect(p.price).toBeLessThanOrEqual(50));
    });

    it('filters by price range', () => {
      const result = service.findAll({ minPrice: 30, maxPrice: 100 });
      result.forEach((p) => {
        expect(p.price).toBeGreaterThanOrEqual(30);
        expect(p.price).toBeLessThanOrEqual(100);
      });
    });

    it('filters by category (case-insensitive)', () => {
      const result = service.findAll({ category: 'electronics' });
      result.forEach((p) => expect(p.category.toLowerCase()).toBe('electronics'));
      expect(result.length).toBeGreaterThan(0);
    });

    it('searches by name (case-insensitive)', () => {
      const result = service.findAll({ search: 'headphones' });
      expect(result.length).toBeGreaterThan(0);
      result.forEach((p) =>
        expect(
          p.name.toLowerCase().includes('headphones') ||
            p.description.toLowerCase().includes('headphones'),
        ).toBe(true),
      );
    });

    it('searches by description (case-insensitive)', () => {
      const result = service.findAll({ search: 'agile software' });
      expect(result.length).toBeGreaterThan(0);
    });

    it('filters inStockOnly', () => {
      const result = service.findAll({ inStockOnly: true });
      result.forEach((p) => expect(p.inStock).toBe(true));
    });

    it('returns out-of-stock items when inStockOnly is false', () => {
      const all = service.findAll({});
      const inStockOnly = service.findAll({ inStockOnly: true });
      expect(all.length).toBeGreaterThanOrEqual(inStockOnly.length);
    });

    it('sorts by price ascending', () => {
      const result = service.findAll({ sortBy: 'price', sortOrder: 'asc' });
      for (let i = 1; i < result.length; i++) {
        expect(result[i].price).toBeGreaterThanOrEqual(result[i - 1].price);
      }
    });

    it('sorts by price descending', () => {
      const result = service.findAll({ sortBy: 'price', sortOrder: 'desc' });
      for (let i = 1; i < result.length; i++) {
        expect(result[i].price).toBeLessThanOrEqual(result[i - 1].price);
      }
    });

    it('sorts by name ascending', () => {
      const result = service.findAll({ sortBy: 'name', sortOrder: 'asc' });
      for (let i = 1; i < result.length; i++) {
        expect(result[i].name.localeCompare(result[i - 1].name)).toBeGreaterThanOrEqual(0);
      }
    });

    it('combines multiple filters', () => {
      const result = service.findAll({
        category: 'Electronics',
        inStockOnly: true,
        maxPrice: 200,
      });
      result.forEach((p) => {
        expect(p.category.toLowerCase()).toBe('electronics');
        expect(p.inStock).toBe(true);
        expect(p.price).toBeLessThanOrEqual(200);
      });
    });

    it('returns empty array when no products match', () => {
      const result = service.findAll({ search: 'xyznonexistentproduct123' });
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('returns product when it exists', () => {
      const product = service.findById(1);
      expect(product).toBeDefined();
      expect(product.id).toBe(1);
    });

    it('throws NotFoundException for missing product', () => {
      expect(() => service.findById(9999)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('creates a new product and returns it with an id', () => {
      const dto = {
        name: 'Test Product',
        description: 'A test description',
        price: 9.99,
        category: 'Test',
        inStock: true,
      };
      const created = service.create(dto);
      expect(created.id).toBeDefined();
      expect(created.name).toBe(dto.name);
      expect(created.price).toBe(dto.price);
    });

    it('increments id for each new product', () => {
      const dto = {
        name: 'Product A',
        description: 'Desc',
        price: 10,
        category: 'X',
        inStock: true,
      };
      const p1 = service.create(dto);
      const p2 = service.create({ ...dto, name: 'Product B' });
      expect(p2.id).toBe(p1.id + 1);
    });
  });
});
