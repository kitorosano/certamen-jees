import { EventType } from "./types";

export enum LANGUAGES {
  ES = "es",
}

export const DEFAULT_LANG = LANGUAGES.ES;

export const PRESENTATION_CHANNEL = "certamen-presentation";

export const EFFECT_TIMEOUT = {
  [EventType.EFFECT_CORRECT]: 2600,
  [EventType.EFFECT_INCORRECT]: 1800,
};
