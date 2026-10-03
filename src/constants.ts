import { EventType, QuestionTypes } from "./types";

export enum LANGUAGES {
  ES = "es",
}

export const DEFAULT_LANG = LANGUAGES.ES;

export const QuestionTypeLabels: Record<QuestionTypes, string> = {
  [QuestionTypes.QUESTION]: "Pregunta",
  [QuestionTypes.MEMORY]: "Versiculo de Memoria",
  [QuestionTypes.SWORDPLAY]: "Esgrima Bíblico",
};

export const PRESENTATION_CHANNEL = "certamen-presentation";

export const EFFECT_TIMEOUT = {
  [EventType.EFFECT_CORRECT]: 2600,
  [EventType.EFFECT_INCORRECT]: 1800,
};
