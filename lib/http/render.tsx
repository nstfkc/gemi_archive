import { renderToString } from "react-dom/server";

const views: Record<string, { default: <T>(data: T) => JSX.Element }> =
  import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
    eager: true,
  });

export function render<Data>(
  viewPath: string,
  data: Data,
  path: string,
  template: string,
  routeViewMap: Record<string, string>,
) {
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
  };

  const scripts = `<script>window.serverData = '${JSON.stringify(
    serverData,
  )}';</script>`;

  const apphtml = renderToString(<Children data={data} />);

  return template
    .replace(`<!--app-html-->`, apphtml)
    .replace(`<!--server-data-->`, scripts);
}
