'use server';

import { CartItem } from '@/types';
import { convertToPlainObject, formatErrorMessage } from '../utils';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema } from '../validators';

export const addItemToCart = async (data: CartItem) => {
  try {
    // Check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) {
      throw new Error('Cart session not found');
    }

    // get session and user ID
    const session = await auth();
    const userid = session?.user?.id ? (session.user.id as string) : undefined;

    // Get cart
    const cart = await getMyCart();

    // Parse and validate
    const item = cartItemSchema.parse(data);

    // Find product in DB
    const product = await prisma.product.findFirst({ where: { id: item.productId } });
    return { success: true, message: 'Item added to cart' };
  } catch (error) {
    return { success: false, message: formatErrorMessage(error) };
  }
};

export const getMyCart = async () => {
  // Check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;

  if (!sessionCartId) {
    throw new Error('Cart session not found');
  }

  // get session and user ID
  const session = await auth();
  const userid = session?.user?.id ? (session.user.id as string) : undefined;

  // Get user cart
  const cart = await prisma.cart.findFirst({
    where: userid ? { userId: userid } : { sessionCartId: sessionCartId },
  });

  if (!cart) {
    return undefined;
  }

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.shippingPrice.toString(),
  });
};
