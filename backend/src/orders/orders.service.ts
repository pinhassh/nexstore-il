import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ProductsService } from '../products/products.service';
import { Order } from './order.entity';
import { CreateOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  private orders: Order[] = [];

  constructor(private readonly productsService: ProductsService) {}

  create(userId: string, dto: CreateOrderDto): Order {
    const orderItems = dto.items.map(({ productId, quantity }) => {
      let product;
      try {
        product = this.productsService.findById(productId);
      } catch {
        throw new NotFoundException(`Product #${productId} not found`);
      }
      if (!product.inStock) {
        throw new BadRequestException(`Product "${product.name}" is out of stock`);
      }
      return { productId, quantity, unitPrice: product.price };
    });

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    const order: Order = {
      id: uuidv4(),
      userId,
      items: orderItems,
      totalPrice: Math.round(totalPrice * 100) / 100,
      status: 'pending',
      createdAt: new Date(),
    };

    this.orders.push(order);
    return order;
  }

  findByUser(userId: string): Order[] {
    return this.orders.filter((o) => o.userId === userId);
  }
}
