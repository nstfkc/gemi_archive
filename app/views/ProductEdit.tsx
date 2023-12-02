import { Link } from "@/lib/client/router";
import { useRouteParams } from "@/lib/client/router/useRouteParams";

interface ProductEditData {
  message: string;
}

const ProductEdit = (props: { data: ProductEditData }) => {
  const { productId } = useRouteParams();
  return (
    <div>
      <div>ProductEdit View {productId}</div>
      {props.data.message}
      <div>
        <Link href="/product/1234" className="font-bold text-sm">
          Back to Product
        </Link>
      </div>
    </div>
  );
};

export default ProductEdit;
