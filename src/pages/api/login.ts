import { AUTH_COOKIE, getAuthCookieValue, isValidPassword } from "@utils/auth";
import type { APIContext } from "astro";

export async function POST({
  request,
  cookies,
  redirect,
}: APIContext): Promise<Response> {
  const formData = await request.formData();
  const password = formData.get("password");

  if (typeof password !== "string" || !password) {
    return redirect("/login?error=1");
  }

  if (!isValidPassword(password)) return redirect("/login?error=1");

  cookies.set(AUTH_COOKIE, getAuthCookieValue(), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return redirect("/");
}
