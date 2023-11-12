import { expect, test } from "vitest";
import { createRouteMatcher } from "./routeMatcher";

test("matches routes", () => {
  const routeMatcher = createRouteMatcher([
    "/",
    "/:id",
    "/foo/:id",
    "/bar/:id/baz",
    "/foo/:id/baz/:optional?",
    "/products/:productId/edit",
  ]);

  expect(routeMatcher("/").match).toEqual("/");
  expect(routeMatcher("/").params).toEqual({});

  expect(routeMatcher("/s123").match).toEqual("/:id");
  expect(routeMatcher("/s123").params).toEqual({ id: "s123" });

  expect(routeMatcher("/foo/1234").match).toEqual("/foo/:id");
  expect(routeMatcher("/foo/1234").params).toStrictEqual({ id: "1234" });

  expect(routeMatcher("/bar/1234/baz").match).toEqual("/bar/:id/baz");
  expect(routeMatcher("/bar/1234/baz").params).toStrictEqual({ id: "1234" });

  expect(routeMatcher("/foo/abcd/baz/1234").match).toEqual(
    "/foo/:id/baz/:optional?",
  );

  expect(routeMatcher("/foo/abcd/baz/1234").params).toStrictEqual({
    id: "abcd",
    optional: "1234",
  });

  expect(routeMatcher("/foo/abcd/baz").params).toStrictEqual({
    id: "abcd",
  });

  expect(routeMatcher("/products/abcd/edit").params).toStrictEqual({
    productId: "abcd",
  });
});
