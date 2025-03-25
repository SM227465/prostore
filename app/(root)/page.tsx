import ProductList from '@/components/shared/product/product-list';
import { getLatestProduct } from '@/lib/actions/product.action';

const Home = async () => {
  const latestProduct = await getLatestProduct();

  const modifiedLatestProduct = latestProduct.map((product) => {
    return {
      ...product,
      price: Number(product.price),
      rating: Number(product.price),
    };
  });

  return (
    <>
      <ProductList data={modifiedLatestProduct} title='Newest Arrivals' limit={4} />
    </>
  );
};
export default Home;
