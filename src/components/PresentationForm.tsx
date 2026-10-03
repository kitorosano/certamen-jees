import { PRESENTATION_CHANNEL } from "@constants";
import type { PresentationEvent, QuestionItem } from "@types";
import { EventType, QuestionTypes } from "@types";
import { useTranslations } from "@utils/translations";
import { useEffect, useMemo, useRef, useState } from "react";
import ActionSection from "./ActionSection";

type Entry = {
  id: number;
  title: string;
};

type Props = {
  memories: Entry[];
  swordplays: Entry[];
};

const citationTypes = new Set([QuestionTypes.MEMORY, QuestionTypes.SWORDPLAY]);

export default function PresentationForm({ memories, swordplays }: Props) {
  const { t } = useTranslations();
  const [type, setType] = useState(QuestionTypes.QUESTION);
  const [value, setValue] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [status, setStatus] = useState(t("panel.form.status.default"));
  const [currentQuestion, setCurrentQuestion] = useState<QuestionItem | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const previewWindowRef = useRef<Window | null>(null);

  const options = useMemo(
    () => (type === QuestionTypes.MEMORY ? memories : swordplays),
    [memories, swordplays, type],
  );
  const isCitationType = citationTypes.has(type);

  useEffect(() => {
    const channel = new BroadcastChannel(PRESENTATION_CHANNEL);
    channelRef.current = channel;

    const handleMessage = (event: MessageEvent<PresentationEvent>) => {
      if (event.data?.type !== EventType.PREVIEW_READY || !currentQuestion)
        return;
      channel.postMessage({
        type: EventType.PREVIEW_SHOW,
        payload: currentQuestion,
      });
    };

    channel.addEventListener("message", handleMessage);
    return () => {
      channel.removeEventListener("message", handleMessage);
      channel.close();
    };
  }, [currentQuestion]);

  const selectType = (nextType: QuestionTypes) => {
    setType(nextType);
    setValue("");
    setSelectedId("");
    setOptionsOpen(false);
  };

  const selectEntry = (entry: Entry) => {
    setValue(entry.title);
    setSelectedId(entry.id.toString());
    setOptionsOpen(false);
  };

  const fetchQuestion = async (id: string) => {
    const response = await fetch(
      `/api/questions/${type}/${encodeURIComponent(id)}`,
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? t("errors.entry"));
    return data as QuestionItem;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const typedEntry = options.find(
      (entry) =>
        entry.title.trim().toLocaleLowerCase() ===
        value.trim().toLocaleLowerCase(),
    );
    const id = selectedId || typedEntry?.id.toString() || value.trim();
    if (!id) return;
    if (isCitationType && !selectedId && !typedEntry) {
      setStatus(t("panel.form.status.verse"));
      return;
    }

    setLoading(true);
    setStatus(t("panel.form.status.loading"));
    try {
      const question = await fetchQuestion(id);
      setCurrentQuestion(question);
      channelRef.current?.postMessage({
        type: EventType.PREVIEW_SHOW,
        payload: question,
      });
      setStatus(t(`panel.form.status.showing_${type}`, { id: question.id }));
    } catch (error) {
      setCurrentQuestion(null);
      setStatus(error instanceof Error ? error.message : t("errors.entry"));
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setCurrentQuestion(null);
    channelRef.current?.postMessage({
      type: EventType.PREVIEW_CLEAR,
      payload: null,
    });
    setStatus(t("panel.form.status.cleared"));
  };

  return (
    <>
      <form id="presentation-form" onSubmit={submit}>
        <fieldset>
          {Object.values(QuestionTypes).map((questionType) => (
            <label className="type-option" key={questionType}>
              <input
                type="radio"
                name="type"
                value={questionType}
                checked={type === questionType}
                onChange={() => selectType(questionType)}
              />
              <span>{t(`panel.form.types.${questionType}`)}</span>
            </label>
          ))}
        </fieldset>

        <div className="id-row">
          <div className="combobox">
            <input
              id="entry-id"
              name="id"
              type="text"
              inputMode={isCitationType ? "text" : "numeric"}
              required
              placeholder={
                isCitationType
                  ? t("panel.form.input.placeholder_verse")
                  : t("panel.form.input.placeholder_question")
              }
              autoComplete="off"
              role="combobox"
              aria-expanded={optionsOpen}
              aria-controls="entry-options"
              value={value}
              onFocus={() => isCitationType && setOptionsOpen(true)}
              onChange={(event) => {
                setValue(event.target.value);
                setSelectedId("");
                setOptionsOpen(isCitationType);
              }}
            />
            {isCitationType && optionsOpen && (
              <div id="entry-options" className="options" role="listbox">
                {options
                  .filter((entry) =>
                    entry.title
                      .toLocaleLowerCase()
                      .includes(value.trim().toLocaleLowerCase()),
                  )
                  .map((entry) => (
                    <button
                      type="button"
                      className="option"
                      role="option"
                      key={entry.id}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => selectEntry(entry)}
                    >
                      {entry.title}
                    </button>
                  ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading}>
            {loading
              ? t("panel.form.button.loading")
              : t("panel.form.button.submit")}
          </button>
        </div>
        <p id="status" className="status" role="status">
          {status}
        </p>
      </form>

      <ActionSection
        title={t("panel.form.preview_action_title")}
        ariaLabel={t("panel.form.preview_action_title")}
        className="presentation-actions"
        actions={[
          {
            label: t("panel.form.actions.open"),
            className: "secondary",
            onClick: () => {
              previewWindowRef.current = window.open("/preview", "_blank");
              setStatus(
                previewWindowRef.current
                  ? t("panel.form.status.ready")
                  : t("panel.form.status.error"),
              );
            },
          },
          {
            label: t("panel.form.actions.clear"),
            className: "secondary",
            disabled: !currentQuestion,
            onClick: clear,
          },
        ]}
      />

      <ActionSection
        title={t("panel.form.effect_action_title")}
        ariaLabel={t("panel.form.effect_action_title")}
        className="answer-actions"
        actionsClassName="answer-buttons"
        actions={[
          {
            label: t("panel.form.actions.correct"),
            className: "correct",
            icon: "✓",
            disabled: !currentQuestion,
            onClick: () =>
              channelRef.current?.postMessage({
                type: EventType.EFFECT_CORRECT,
                payload: currentQuestion,
              }),
          },
          {
            label: t("panel.form.actions.incorrect"),
            className: "incorrect",
            icon: "✕",
            disabled: !currentQuestion,
            onClick: () =>
              channelRef.current?.postMessage({
                type: EventType.EFFECT_INCORRECT,
                payload: currentQuestion,
              }),
          },
        ]}
      />
    </>
  );
}
