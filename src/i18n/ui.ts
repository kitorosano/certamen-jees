import { LANGUAGES } from "@constants";
import type { Translation, TranslationModule } from "@types";

const translationModules = import.meta.glob<TranslationModule>("./*.ts", {
  eager: true,
});

export const ui = Object.fromEntries(
  Object.values(LANGUAGES).map((language) => {
    const modulePath = `./${language}.ts`;
    const translationModule = translationModules[modulePath];
    const translation = translationModule?.[language];

    if (!translation) {
      throw new Error(
        `No se encontró una traducción válida para el idioma "${language}" en "${modulePath}".`,
      );
    }

    return [language, translation];
  }),
) as Record<LANGUAGES, Translation>;
