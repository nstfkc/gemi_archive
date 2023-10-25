import { ReactNode, useEffect, useState } from "react";

interface DynamicRouteProps {
  path: string;
  fallback: ReactNode;
}

export const DynamicRoute = (props: DynamicRouteProps) => {
  const { path, fallback } = props;
  const [element, setElement] = useState(fallback);

  useEffect(() => {
    fetch(`/__route${path}`)
      .then((res) => res.json())
      .then(({ module, data }) => {
        const script = document.createElement("script");
        script.src = [window.location.origin, module.fileName].join("/");
        script.type = "module";
        document.body.append(script);
        script.onload = () => {
          const C = window.component;

          setElement(<C data={data} />);
        };
      });
  }, []);

  return <>{element}</>;
};
