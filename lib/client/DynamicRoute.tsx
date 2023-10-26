import { ReactNode, useEffect, useState } from "react";

interface DynamicRouteProps {
  path: string;
  fallback: ReactNode;
}

async function loadScript(fileName: string) {
  const src = [window.location.origin, fileName].join("/");
  console.log(`[src=${src}]`);
  if (document.querySelector(`[src="${window.location.origin}/${fileName}"]`)) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.type = "module";
    document.body.append(script);
    script.onload = () => {
      resolve({});
    };
  });
}

export const DynamicRoute = (props: DynamicRouteProps) => {
  const { path, fallback } = props;
  const [element, setElement] = useState(fallback);

  useEffect(() => {
    fetch(`/__route${path}`)
      .then((res) => res.json())
      .then(({ data, view }) => {
        const { fileName, imports } = JSON.parse(window.routeManifest).find(
          (m) => m.name === view
        );
        loadScript(fileName).then(() => {
          const C = window.component;

          setElement(<C data={data} />);
        });
      });
  }, []);

  return <>{element}</>;
};
