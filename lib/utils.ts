import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertToPlainObject = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

// format number with decimal places
export const formatNumberWithDecimal = (price: number): string => {
  const [int, decimal] = price.toString().split('.');

  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
};
