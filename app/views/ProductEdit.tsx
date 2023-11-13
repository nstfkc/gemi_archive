import { Link } from "@/lib/client/router";

interface ProductEditData {
  action: string;
}

const ProductEdit = (props: { data: ProductEditData }) => {
  return (
    <div>
      <div>ProductEdit View</div>
      {props.data.action}
      <div>
        <Link href="/product/1234" className="font-bold text-sm">
          Back to Product
        </Link>
      </div>
    </div>
  );
};

export default ProductEdit;
