import { AUTH_COOKIE } from "@utils/auth";
import type { APIContext } from "astro";

export function POST({ cookies, redirect }: APIContext): Response {
  cookies.delete(AUTH_COOKIE, { path: "/" });
  return redirect("/login");
}
