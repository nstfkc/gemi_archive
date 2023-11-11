import { PropsWithChildren, useEffect } from "react";

const PublicLayout = (props: PropsWithChildren) => {
  useEffect(() => {
    console.log("PublicLayout mounted");
    return () => {
      console.log("PublicLayout unmounted");
    };
  }, []);

  return (
    <div>
      <h1>{props.data.title}</h1>
      {props.children}
    </div>
  );
};

export default PublicLayout;
