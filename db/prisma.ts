import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient, Product } from '@prisma/client';
import ws from 'ws';

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString });

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool);

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product: Product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product: Product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        //@ts-ignore
        needs: { itemsPrice: true },
        compute(cart) {
          //@ts-ignore
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        //@ts-ignore
        needs: { shippingPrice: true },
        compute(cart) {
          //@ts-ignore
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        //@ts-ignore
        needs: { taxPrice: true },
        compute(cart) {
          //@ts-ignore
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        //@ts-ignore
        needs: { totalPrice: true },
        compute(cart) {
          //@ts-ignore
          return cart.totalPrice.toString();
        },
      },
    },
    order: {
      itemsPrice: {
        //@ts-ignore
        needs: { itemsPrice: true },
        compute(cart) {
          //@ts-ignore
          return cart.itemsPrice.toString();
        },
      },
      shippingPrice: {
        //@ts-ignore
        needs: { shippingPrice: true },
        compute(cart) {
          //@ts-ignore
          return cart.shippingPrice.toString();
        },
      },
      taxPrice: {
        //@ts-ignore
        needs: { taxPrice: true },
        compute(cart) {
          //@ts-ignore
          return cart.taxPrice.toString();
        },
      },
      totalPrice: {
        //@ts-ignore
        needs: { totalPrice: true },
        compute(cart) {
          //@ts-ignore
          return cart.totalPrice.toString();
        },
      },
    },
    orderItem: {
      price: {
        //@ts-ignore
        compute(cart) {
          return cart.price.toString();
        },
      },
    },
  },
});
