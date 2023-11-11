import { PropsWithChildren } from "react";
import { renderToString } from "react-dom/server";

const views: Record<string, { default: <T>(data: T) => JSX.Element }> =
  import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
    eager: true,
  });

export function render<Data>(config: {
  viewPath: string;
  data: Data;
  path: string;
  template: string;
  routeViewMap: Record<string, string>;
  layout?: (children: JSX.Element) => JSX.Element;
  layoutData?: unknown;
}) {
  const {
    data,
    path,
    routeViewMap,
    template,
    viewPath,
    layout = (children) => <>{children}</>,
    layoutData = {},
  } = config;
  let Children = (_props: { data: Data }) => <></>;
  try {
    Children = views[`/app/views/${viewPath}.tsx`].default;
  } catch (err) {
    console.log(err);
    // eslint-disable-next-line react/display-name
    Children = () => <div>Cannot find {viewPath} view</div>;
  }

  const serverData = {
    routeViewMap,
    routeData: { [path]: data },
    routes: Object.keys(routeViewMap),
    currentRoute: path,
    layoutData,
  };

  const scripts = `<script>window.serverData = '${JSON.stringify(
    serverData,
  )}';</script>`;

  const apphtml = renderToString(layout(<Children data={data} />));

  return template
    .replace(`<!--app-html-->`, apphtml)
    .replace(`<!--server-data-->`, scripts);
}

export function renderLayout<Data>(
  viewPath: string,
  data: Data,
  wrapper: (children: JSX.Element) => JSX.Element,
) {
  let Layout = (props: PropsWithChildren<{ data: Data }>) => (
    <>{props.children}</>
  );
  try {
    Layout = views[`/app/views/${viewPath}.tsx`].default;
  } catch (err) {
    console.log(err);
    // eslint-disable-next-line react/display-name
    Layout = () => <div>Cannot find {viewPath} layout</div>;
  }

  // eslint-disable-next-line react/display-name

  return {
    wrapper: (children: JSX.Element) =>
      wrapper(<Layout data={data}>{children}</Layout>),
    data,
  };
}
