import { Controller } from "@/lib/server/Controller";
import { createRequest } from "@/lib/server/createRequest";

import * as z from "zod";

const postUpdateRequest = createRequest({
  text: z.string(),
  email: z.string().email(),
  password: z.string().min(8),
});

export class PostController extends Controller {
  update = postUpdateRequest.next((input) => {
    return {};
  });
}
