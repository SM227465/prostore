'use server';

import { PrismaClient } from '@prisma/client';
import { convertToPlainObject } from '../utils';

export const getLatestProduct = async () => {
  const prisma = new PrismaClient();

  const data = await prisma.product.findMany({ take: 4, orderBy: { createdAt: 'desc' } });

  return convertToPlainObject(data);
};
