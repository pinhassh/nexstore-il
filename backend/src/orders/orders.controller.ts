import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.sub, dto);
  }

  @Get()
  findMine(@Request() req) {
    return this.ordersService.findByUser(req.user.sub);
  }
}
