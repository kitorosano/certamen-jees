import { LiveEntryNotFoundError } from "astro/content/runtime";
import { getLiveEntry } from "astro:content";
import { QuestionTypes } from "../../../../types";
import type { QuestionItem } from "../../../../types";

const allowedTypes = new Set(Object.values(QuestionTypes));

interface Props {
  params: {
    type?: string;
    id?: string;
  };
}

export async function GET({ params }: Props): Promise<Response> {
  const type = params.type;
  const id = params.id;

  if (!type || !id || !allowedTypes.has(type as QuestionTypes))
    return Response400();

  const { entry, error } = await getLiveEntry(type as QuestionTypes, id);

  if (error) {
    if (error instanceof LiveEntryNotFoundError) return Response404();

    console.error(`Error loading presentation entry: ${error.message}`);
    return Response502();
  }

  if (!entry) return Response404();

  const data = entry.data as QuestionItem;
  const parsedId = Number(id);
  const item: QuestionItem = {
    ...data,
    id: data.id ?? (Number.isFinite(parsedId) ? parsedId : undefined),
  };

  return Response.json(item);
}

function Response400(): Response {
  return Response.json(
    { error: "Tipo o identificador inválido." },
    { status: 400 },
  );
}

function Response404(): Response {
  return Response.json(
    { error: "No se encontró la pregunta solicitada." },
    { status: 404 },
  );
}

function Response502(): Response {
  return Response.json(
    { error: "No se pudo cargar la pregunta." },
    { status: 502 },
  );
}
