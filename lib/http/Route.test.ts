import { describe, it, expect } from "vitest";
import { Controller, Ctx } from "./Controller";
import { Route } from "./Route";

class PostControler extends Controller {
  list = () => {};

  show = ({ params }: Ctx<{ postId: string }>) => {
    return { id: params.postId };
  };
}

class AccountController extends Controller {
  index = () => {};
}

const web = {
  public: {
    "/": Route.view("Home"),
    "/posts": Route.view("Posts", [PostControler, "list"]),
    "/post/:postId": Route.view("Posts", [PostControler, "show"]),
    "/about": Route.view("About", () => {
      return { companyName: "Acme inc." };
    }),
  },
  private: {
    "/account": Route.view("Account", [AccountController, "index"]),
  },
};

describe("Route.ts", () => {
  it("should view", async () => {
    const req = new Request("http://localhost:3000/posts/1234");
    expect(req.url).toEqual("/posts/1234");
  });
});
