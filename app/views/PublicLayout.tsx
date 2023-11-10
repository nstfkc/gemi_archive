import { PropsWithChildren } from "react";

const PublicLayout = (props: PropsWithChildren) => {
  return (
    <div>
      <h1>Public layout</h1>
      {props.children}
    </div>
  );
};

export default PublicLayout;
