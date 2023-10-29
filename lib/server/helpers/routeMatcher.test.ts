// sum.test.js
import { expect, test, vi } from "vitest";
import { createRouteMatcher } from "./routeMatcher";

test("matches routes", () => {
  const home = vi.fn();
  const foo = vi.fn();
  const bar = vi.fn();

  const routes = {
    "/": home,
    "/foo/:id": foo,
    "/bar/:id/:xid": bar,
  } as any;

  const routeMatcher = createRouteMatcher(routes);

  const { match: homeMatch, params: homeParams } = routeMatcher("/");
  const homeHandler = routes[homeMatch]!;
  homeHandler?.(homeParams);
  expect(home).toBeCalledTimes(1);

  const { match: fooMatch, params: fooParams } = routeMatcher("/foo/1234");
  const fooHandler = routes[fooMatch]!;
  fooHandler?.(fooParams);
  expect(foo).toBeCalledTimes(1);

  const { match: barMatch, params: barParams } = routeMatcher("/bar/1234/abcd");
  const barHandler = routes[barMatch]!;
  barHandler?.(...barParams);
  expect(bar).toBeCalledTimes(1);
  expect(bar).toBeCalledWith("1234", "abcd");
});
