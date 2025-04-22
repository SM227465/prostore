'use server';

import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { convertToPlainObject } from '../utils';

export const getLatestProduct = async () => {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
};

export const getProductBySlug = async (slug: string) => {
  return await prisma.product.findFirst({ where: { slug: slug } });
};
