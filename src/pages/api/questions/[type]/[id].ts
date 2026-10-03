import type { QuestionItem } from "@types";
import { QuestionTypes } from "@types";
import { Response400, Response404, Response502 } from "@utils/responses";
import { LiveEntryNotFoundError } from "astro/content/runtime";
import { getLiveEntry } from "astro:content";

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
  return Response.json(data);
}
