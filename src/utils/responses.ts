import { useTranslations } from "./translations";

const { t } = useTranslations();

export function Response400(): Response {
  return Response.json({ error: t("api.400") }, { status: 400 });
}

export function Response404(): Response {
  return Response.json({ error: t("api.404") }, { status: 404 });
}

export function Response502(): Response {
  return Response.json({ error: t("api.502") }, { status: 502 });
}
