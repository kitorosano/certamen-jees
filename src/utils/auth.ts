import type { AstroCookies } from "astro";
import { PASSWORD } from "astro:env/server";
import { createHash, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE = "certamen-auth";

function getAuthToken(): string {
  return createHash("sha256").update(`certamen-jees:${PASSWORD}`).digest("hex");
}

function hash(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function isValidPassword(password: string): boolean {
  const expected = hash(PASSWORD);
  const received = hash(password);

  return timingSafeEqual(expected, received);
}

export function getAuthCookieValue(): string {
  return getAuthToken();
}

export function isAuthenticated(cookies: AstroCookies): boolean {
  const cookie = cookies.get(AUTH_COOKIE)?.value;
  if (!cookie) return false;

  const expected = hash(getAuthToken());
  const received = hash(cookie);

  return timingSafeEqual(expected, received);
}
