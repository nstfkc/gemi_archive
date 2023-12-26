import { PropsWithChildren } from "react";
import { App } from "../app";
import { renderRoutes } from "../renderRoutes";

export function render<Data>(config: {
  viewPath: string;
  data: Data;
  path: string;
  template: string;
  routeManifest: Record<string, any>;
  layout?: (children: JSX.Element) => JSX.Element;
  layoutData?: unknown;
  params: Record<string, string>;
  url: string;
  styles: string;
  scripts: string;
}) {
  const {
    data,
    path,
    routeManifest,
    layoutData = {},
    params,
    url,
    styles,
    scripts,
  } = config;

  const serverData = {
    routeManifest,
    routeData: { [path]: data },
    currentRoute: path,
    currentUrl: url,
    layoutData,
    params,
  };

  const routes = renderRoutes(routeManifest);

  return {
    App: () => (
      <html>
        <head
          dangerouslySetInnerHTML={{
            __html: `${scripts}\n${styles}`,
          }}
        ></head>
        <body>
          <App serverData={serverData}>{routes}</App>
        </body>
      </html>
    ),
    serverData,
    routes,
  };
}

export function renderLayout<Data>(
  viewPath: string,
  data: Record<string, Data>,
  wrapper: (children: JSX.Element) => JSX.Element,
) {
  let Layout = (props: PropsWithChildren<{ data: Data }>) => (
    <>{props.children}</>
  );
  /* try {
   *   Layout = views[`/app/views/${viewPath}.tsx`].default;
   * } catch (err) {
   *   console.log(err);
   *   // eslint-disable-next-line react/display-name
   *   Layout = () => <div>Cannot find {viewPath} layout</div>;
   * } */

  // eslint-disable-next-line react/display-name

  return {
    wrapper: (children: JSX.Element) =>
      wrapper(<Layout data={data[viewPath]}>{children}</Layout>),
    data,
  };
}
