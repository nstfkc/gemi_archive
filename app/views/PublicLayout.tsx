import { PropsWithChildren } from "react";

const PublicLayout = (props: PropsWithChildren) => {
  return (
    <div>
      <span>{props.data.title}</span>
      {props.children}
    </div>
  );
};

export default PublicLayout;
