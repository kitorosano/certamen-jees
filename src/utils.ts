import type { QuestionItem } from "./types";

export function getPresentationId(item?: QuestionItem, fallback = ""): string {
  return item?.id?.toString() ?? fallback;
}
