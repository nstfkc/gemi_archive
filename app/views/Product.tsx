import { Link } from "@/lib/client/router";

interface ProductData {
  productTitle: string;
}

const Product = (props: { data: ProductData }) => {
  return (
    <div>
      <div>Product View</div>
      <div>
        <Link href="/product/edit" className="font-bold text-sm">
          {props.data.productTitle}
        </Link>
      </div>
      <div>
        <Link href="/dashboard" className="font-bold text-sm">
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Product;
