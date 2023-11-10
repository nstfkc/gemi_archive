import { renderToString } from "react-dom/server";
import { web } from "../../app/http/routes";
import { views } from "./views";

export function render(viewPath: string) {
  return (
    data: any,
    path: string,
    template: string,
    routeViewMap: Record<string, string>,
  ): string => {
    let Children = (_data: any) => <></>;
    try {
      Children = views[`/app/views/${viewPath}.tsx`].default;
    } catch (err) {
      console.log(err);
      Children = () => <div>Cannot find {viewPath} view</div>;
    }

    const serverData = {
      routeViewMap,
      routeData: { [path]: data },
      routes: Object.keys(web),
      currentRoute: path,
    };

    const scripts = `<script>window.serverData = '${JSON.stringify(
      serverData,
    )}';</script>`;

    const apphtml = renderToString(<Children data={data} />);

    return template
      .replace(`<!--app-html-->`, apphtml)
      .replace(`<!--server-data-->`, scripts);
  };
}
