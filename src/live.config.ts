import { sheetLiveLoader } from "astro-sheet-loader";
import { z } from "astro/zod";
import { defineLiveCollection } from "astro:content";
import { DOCUMENT_ID } from "astro:env/server";
import { QuestionTypes } from "./types";

const questions = defineLiveCollection({
  loader: sheetLiveLoader({
    document: DOCUMENT_ID,
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
    document: DOCUMENT_ID,
    sheet: "Memorias",
    idColumn: "Id",
  }),
  schema: z
    .object({
      Id: z.number(),
      Cita: z.string(),
      Versiculo: z.string().optional(),
    })
    .transform((data) => ({
      type: QuestionTypes.MEMORY,
      id: data.Id,
      title: data.Cita,
      answers: [data.Versiculo].filter((v): v is string => !!v),
    })),
});

const swordplays = defineLiveCollection({
  loader: sheetLiveLoader({
    document: DOCUMENT_ID,
    sheet: "Esgrimas",
    idColumn: "Id",
  }),
  schema: z
    .object({
      Id: z.number(),
      Cita: z.string(),
    })
    .transform((data) => ({
      type: QuestionTypes.SWORDPLAY,
      id: data.Id,
      title: data.Cita,
      answers: [],
    })),
});

export const collections = { questions, memories, swordplays };
