import { isAuthenticated } from "@utils/auth";
import { Response401 } from "@utils/responses";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(
  ({ url, cookies, redirect }, next) => {
    const isPanel = url.pathname === "/";
    const isQuestionsApi = url.pathname.startsWith("/api/questions/");

    if (!isPanel && !isQuestionsApi) return next();
    if (isAuthenticated(cookies)) return next();

    if (isQuestionsApi) return Response401();

    return redirect("/login");
  },
);
