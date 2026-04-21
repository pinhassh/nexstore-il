import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  healthCheck() {
    return {
      status: 'ok',
      message: 'NexStore API is running',
      version: '1.0.0',
      endpoints: {
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
        },
        users: {
          listAll: 'GET /api/users (admin)',
          updateSelf: 'PUT /api/users/me (auth)',
          updateById: 'PUT /api/users/:id (admin)',
        },
        products: {
          list: 'GET /api/products',
          create: 'POST /api/products (admin)',
        },
        orders: {
          create: 'POST /api/orders (auth)',
          myOrders: 'GET /api/orders (auth)',
        },
      },
    };
  }
}
