'use server';

import { CartItem } from '@/types';
import { convertToPlainObject, formatErrorMessage, round2 } from '../utils';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// Calculate cart price
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  );

  const shippingPrice = round2(itemsPrice > 100 ? 0 : 10);
  const taxPrice = round2(0.15 * itemsPrice);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

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

    if (!product) {
      throw new Error('Product not found');
    }

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userid: userid,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({ data: newCart });
      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: `${product.name} added to cart` };
    } else {
      // Check if item is already in cart
      const existsItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId);

      if (existsItem) {
        // Check stock
        if (product.stock < existsItem.quantity + 1) {
          throw new Error('Not enough stock');
        }

        // Increase the quantity
        (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.quantity =
          existsItem.quantity + 1;
      } else {
        // If item does not exists
        // Check stock
        if (product.stock < 1) {
          throw new Error('Not enough stock');
        }

        cart.items.push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${existsItem ? 'updated in' : 'added to'} cart`,
      };
    }
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
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.shippingPrice.toString(),
  });
};

export const removeItemFromCart = async (productId: string) => {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) {
      throw new Error('Cart session not found');
    }

    const product = await prisma.product.findFirst({ where: { id: productId } });

    if (!product) {
      throw new Error('Product not found');
    }

    const cart = await getMyCart();

    if (!cart) {
      throw new Error('Cart not found');
    }

    const exists = (cart.items as CartItem[]).find((x) => x.productId === productId);

    if (!exists) {
      throw new Error('Item not found');
    }

    if (exists.quantity === 1) {
      cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exists.productId);
    } else {
      (cart.items as CartItem[]).find((x) => x.productId === productId)!.quantity =
        exists.quantity - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return { success: true, message: `${product.name} was removed from cart` };
  } catch (error) {
    return { success: false, message: formatErrorMessage(error) };
  }
};
