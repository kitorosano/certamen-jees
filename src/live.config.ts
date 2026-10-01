import { sheetLiveLoader } from "astro-sheet-loader";
import { z } from "astro/zod";
import { defineLiveCollection } from "astro:content";
import { QuestionTypes } from "./types";

const questions = defineLiveCollection({
  loader: sheetLiveLoader({
    document: "1pUB3DTLwqKkFKppWg_51JEZRGhdvE8HVuNyJUvkJys8",
    sheet: "Preguntas",
    idColumn: "Id",
  }),
  schema: z
    .object({
      Id: z.number(),
      Pregunta: z.string(),
      ["Respuesta Correcta"]: z.string().optional(),
      ["Respuesta Incorrecta 1"]: z.string().optional(),
      ["Respuesta Incorrecta 2"]: z.string().optional(),
      ["Respuesta Incorrecta 3"]: z.string().optional(),
    })
    .transform((data) => ({
      type: QuestionTypes.QUESTION,
      id: data.Id,
      title: data.Pregunta,
      answers: [
        data["Respuesta Correcta"],
        data["Respuesta Incorrecta 1"],
        data["Respuesta Incorrecta 2"],
        data["Respuesta Incorrecta 3"],
      ]
        .filter((v): v is string => !!v)
        .sort(() => Math.random() - 0.5),
    })),
});

const memories = defineLiveCollection({
  loader: sheetLiveLoader({
    document: "1pUB3DTLwqKkFKppWg_51JEZRGhdvE8HVuNyJUvkJys8",
    sheet: "Memorias",
    idColumn: "Id",
  }),
  schema: z
    .object({
      Cita: z.string(),
    })
    .transform((data) => ({
      type: QuestionTypes.MEMORY,
      id: undefined,
      title: data.Cita,
      answers: [],
    })),
});

const swordplays = defineLiveCollection({
  loader: sheetLiveLoader({
    document: "1pUB3DTLwqKkFKppWg_51JEZRGhdvE8HVuNyJUvkJys8",
    sheet: "Esgrimas",
    idColumn: "Id",
  }),
  schema: z
    .object({
      Cita: z.string(),
    })
    .transform((data) => ({
      type: QuestionTypes.SWORDPLAY,
      id: undefined,
      title: data.Cita,
      answers: [],
    })),
});

export const collections = { questions, memories, swordplays };
