import { http } from "@/lib/client/http";
import { useRouteParams } from "@/lib/client/router/useRouteParams";

interface ProductEditData {
  message: string;
}

const ProductDetails = () => {
  const { data } = http.useQuery("/product/:productId", {
    params: { productId: "1234" },
  });

  return <div>Product Details {data?.title}</div>;
};

const ProductEdit = (props: { data: ProductEditData }) => {
  return (
    <div>
      <div>
        <ProductDetails />
      </div>
    </div>
  );
};

export default ProductEdit;
