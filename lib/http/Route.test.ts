import { describe, it, expect } from "vitest";
import { Controller } from "./Controller";
import { Route, Context } from "./Route";

class PostControler extends Controller {
  list = () => {};

  show = (ctx: Context) => {
    return { data: { id: ctx.req.params.postId } };
  };
}

class AccountController extends Controller {
  index = (_ctx: Context) => {
    return { account: { id: "1234" } };
  };
}

const web = {
  public: {
    "/": Route.view("Home"),
    "/posts": Route.view("Posts"),
    "/post/:postId": Route.view("Posts", [PostControler, "show"]),
  },
  private: {
    "/account": Route.view("Account", [AccountController, "index"]),
  },
};

const api = {
  private: {
    "/account": Route.get([AccountController, "index"]),
  },
};

describe("Route.ts", () => {
  it("should view", async () => {
    const req = new Request("http://localhost:3000/posts/1234");
    expect(req.url).toEqual("/posts/1234");
  });
});
