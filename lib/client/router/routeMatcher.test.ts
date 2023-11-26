import { expect, test, describe } from "bun:test";
import { createRouteMatcher } from "./routeMatcher";

describe("routeMatcher", () => {
  test("matches simple routes", () => {
    const routeMatcher = createRouteMatcher(["/", "/about", "/products"]);

    expect(routeMatcher("/").match).toEqual("/");
    expect(routeMatcher("/").params).toEqual({});
    expect(routeMatcher("/about").match).toEqual("/about");
    expect(routeMatcher("/about").params).toEqual({});
    expect(routeMatcher("/products").match).toEqual("/products");
    expect(routeMatcher("/products").params).toEqual({});
  });

  test("matches routes with variables", () => {
    const routeMatcher = createRouteMatcher(["/:id", "/foo/:id"]);

    expect(routeMatcher("/1234").match).toEqual("/:id");
    expect(routeMatcher("/1234").params).toEqual({ id: "1234" });
    expect(routeMatcher("/foo/1234").match).toEqual("/foo/:id");
    expect(routeMatcher("/foo/1234").params).toStrictEqual({ id: "1234" });
  });

  test("matches routes with optional variables", () => {
    const routeMatcher = createRouteMatcher(["/foo/:id?", "/:id?"]);

    expect(routeMatcher("/1234").match).toEqual("/:id?");
    expect(routeMatcher("/1234").params).toEqual({ id: "1234" });
    expect(routeMatcher("/foo/1234").match).toEqual("/foo/:id?");
    expect(routeMatcher("/foo/1234").params).toStrictEqual({ id: "1234" });
    expect(routeMatcher("/foo").match).toEqual("/foo/:id?");
    expect(routeMatcher("/foo").params).toStrictEqual({});
  });

  test("falls back to wildcard route", () => {
    const routeMatcher = createRouteMatcher(["/about", "/product/:id", "/*"]);

    expect(routeMatcher("/").match).toEqual("/*");
    expect(routeMatcher("/").params).toEqual({});
    expect(routeMatcher("/about").match).toEqual("/about");
    expect(routeMatcher("/about").params).toEqual({});
    expect(routeMatcher("/product/1234").match).toEqual("/product/:id");
    expect(routeMatcher("/product/1234").params).toEqual({ id: "1234" });
    expect(routeMatcher("/product/1234/test").match).toEqual("/*");
    expect(routeMatcher("/product/1234/test").params).toEqual({});
    expect(routeMatcher("/foo/bar").match).toEqual("/*");
    expect(routeMatcher("/foo/bar").params).toEqual({});
  });
});
