import { web } from "@/app/http/routes";

export type Routes = typeof web.public & typeof web.private;
