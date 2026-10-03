import { DEFAULT_LANG, LANGUAGES } from "@constants";
import { ui } from "@i18n/ui";
import type {
  Translation,
  TranslationParams,
  TranslationValue,
} from "@types";

function getTranslation(
  translation: Translation,
  key: string,
): TranslationValue | undefined {
  return key
    .split(".")
    .reduce<
      TranslationValue | undefined
    >((value, segment) => (typeof value === "object" && value !== null ? value[segment] : undefined), translation);
}

export function useTranslations(lang: LANGUAGES = DEFAULT_LANG) {
  const localizedUI = ui[lang];
  const fallbackUI = ui[DEFAULT_LANG];

  function t(key: string, params: TranslationParams = {}): string {
    const value =
      getTranslation(localizedUI, key) ?? getTranslation(fallbackUI, key);

    if (typeof value !== "string") {
      throw new Error(
        `La traducción "${key}" no existe o no contiene un texto válido.`,
      );
    }

    return value.replace(/\{\{\s*(\w+)\s*\}\}/g, (placeholder, name) =>
      name in params ? String(params[name]) : placeholder,
    );
  }

  return { t };
}
