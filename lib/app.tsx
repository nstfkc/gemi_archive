import { hydrateRoot } from "react-dom/client";
import {
  BrowserRouter,
  Route,
  Routes,
  useLoaderData,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const views = import.meta.glob(["@/app/views/**/*", "!**/components/*"], {
  eager: true,
});

const DataLoader = (props: { Component: any }) => {
  const data = useLoaderData();
  console.log(data);
  return <props.Component data={data} />;
};

function createRouter() {
  const { routeViewMap } = JSON.parse(window.serverData);

  return createBrowserRouter(
    Object.entries(routeViewMap).map(([path, { viewPath }]) => {
      const Component = views[`/app/views/${viewPath}.tsx`].default;
      return {
        path,
        element: <DataLoader Component={Component} />,
      };
    })
  );
}

const router = createRouter();

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

hydrateRoot(document.getElementById("app")!, <App />);
