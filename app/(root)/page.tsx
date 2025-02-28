import ProductList from '@/components/shared/product/product-list';
import { getLatestProduct } from '@/lib/actions/product.action';

const Home = async () => {
  const latestProduct = await getLatestProduct();
  return (
    <>
      <ProductList data={latestProduct} title='Newest Arrivals' limit={4} />
    </>
  );
};
export default Home;
