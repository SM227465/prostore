'use client';

import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.action';
import type { Cart, CartItem } from '@/types';
import { Loader, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface Props {
  item: CartItem;
  cart?: Cart;
}

const AddToCart = (props: Props) => {
  const { item, cart } = props;
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({ variant: 'destructive', description: res.message });
        return;
      }

      toast({
        description: res.message,
        action: (
          <ToastAction
            className='bg-primary text-white hover:bg-gray-800'
            altText='Go To Cart'
            onClick={() => router.push('/cart')}
          >
            Go To Cart
          </ToastAction>
        ),
      });
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({ variant: res.success ? 'default' : 'destructive', description: res.message });
      return;
    });
  };

  const existsItem = cart && cart.items.find((x) => x.productId === item.productId);

  return existsItem ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart} disabled={isPending}>
        {isPending ? <Loader className='h-4 w-4 animate-spin' /> : <Minus className='h-4 w-4' />}
      </Button>
      <span className='px-2'>{existsItem.quantity}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart} disabled={isPending}>
        {isPending ? <Loader className='h-4 w-4 animate-spin' /> : <Plus className='h-4 w-4' />}
      </Button>
    </div>
  ) : (
    <Button className='w-full' type='button' onClick={handleAddToCart} disabled={isPending}>
      {isPending ? <Loader className='h-4 w-4 animate-spin' /> : <Plus className='h-4 w-4' />} Add
      to cart
    </Button>
  );
};

export default AddToCart;
