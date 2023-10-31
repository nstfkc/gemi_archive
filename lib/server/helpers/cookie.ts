import type { CookieOptions } from "express";
import { storage } from "../storage";

export function setCookie(name: string, value: string, options: CookieOptions) {
  storage.getStore()?.response.cookie(name, value, options);
}
