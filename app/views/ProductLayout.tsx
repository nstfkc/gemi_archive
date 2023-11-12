import { PropsWithChildren } from "react";

const ProductLayout = (props: PropsWithChildren) => {
  return (
    <div>
      <h1>Product Layout</h1>
      {props.children}
    </div>
  );
};

export default ProductLayout;
