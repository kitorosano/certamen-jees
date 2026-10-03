export type TranslationValue = string | Translation;
export interface Translation {
  [key: string]: TranslationValue;
}
export type TranslationModule = Record<string, Translation>;
export type TranslationParams = Record<string, string | number | boolean>;

export enum QuestionTypes {
  QUESTION = "questions",
  MEMORY = "memories",
  SWORDPLAY = "swordplays",
}

export enum EventType {
  PREVIEW_READY = "preview-ready",
  PREVIEW_CLOSED = "preview-closed",
  PREVIEW_SHOW = "preview-show",
  PREVIEW_CLEAR = "preview-clear",
  EFFECT_CORRECT = "effect-correct",
  EFFECT_INCORRECT = "effect-incorrect",
  EFFECT_CLEAR = "effect-clear",
}

export type QuestionItem = {
  type: QuestionTypes;
  id: number;
  title: string;
  description: string;
  answers: string[];
};

export type PresentationEvent = {
  type: EventType;
  payload: QuestionItem | null;
};

export type EffectType = EventType.EFFECT_CORRECT | EventType.EFFECT_INCORRECT;

export type Action = {
  label: string;
  className: string;
  disabled?: boolean;
  icon?: string;
  onClick: () => void;
};
