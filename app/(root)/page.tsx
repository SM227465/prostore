import ProductList from '@/components/shared/product/product-list';
import { getLatestProduct } from '@/lib/actions/product.action';

const Home = async () => {
  const latestProduct = await getLatestProduct();

  const modifiedLatestProduct = latestProduct.map((product) => {
    return {
      ...product,
      price: String(product.price),
      rating: String(product.price),
    };
  });

  return (
    <>
      <ProductList data={modifiedLatestProduct} title='Newest Arrivals' limit={4} />
    </>
  );
};
export default Home;
