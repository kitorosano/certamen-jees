import { useEffect, useMemo, useRef, useState } from "react";
import { PRESENTATION_CHANNEL, QuestionTypeLabels } from "@constants";
import type { PresentationEvent, QuestionItem } from "@types";
import { EventType, QuestionTypes } from "@types";
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
  const [type, setType] = useState(QuestionTypes.QUESTION);
  const [value, setValue] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [status, setStatus] = useState(
    "Abre la previsualización para comenzar.",
  );
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
    if (!response.ok)
      throw new Error(data.error ?? "No se pudo cargar la entrada.");
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
      setStatus("Selecciona una cita bíblica de la lista.");
      return;
    }

    setLoading(true);
    setStatus("Cargando entrada...");
    try {
      const question = await fetchQuestion(id);
      setCurrentQuestion(question);
      channelRef.current?.postMessage({
        type: EventType.PREVIEW_SHOW,
        payload: question,
      });
      setStatus(
        `Mostrando la ${question.type === QuestionTypes.QUESTION ? `pregunta #${question.id}` : "cita bíblica"}`,
      );
    } catch (error) {
      setCurrentQuestion(null);
      setStatus(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la entrada.",
      );
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
    setStatus("Pantalla limpiada.");
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
              <span>{QuestionTypeLabels[questionType]}</span>
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
              placeholder={isCitationType ? "Ej. Juan 3:16" : "Ej. 1"}
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
            {loading ? "Cargando..." : "Mostrar"}
          </button>
        </div>
        <p id="status" className="status" role="status">
          {status}
        </p>
      </form>

      <ActionSection
        title="Presentación"
        ariaLabel="Controles de presentación"
        className="presentation-actions"
        actions={[
          {
            label: "Abrir previsualización",
            className: "secondary",
            onClick: () => {
              previewWindowRef.current = window.open("/preview", "_blank");
              setStatus(
                previewWindowRef.current
                  ? "Previsualización abierta."
                  : "El navegador bloqueó la pestaña. Permite ventanas emergentes e inténtalo de nuevo.",
              );
            },
          },
          {
            label: "Limpiar pantalla",
            className: "secondary",
            disabled: !currentQuestion,
            onClick: clear,
          },
        ]}
      />

      <ActionSection
        title="Resultado de la respuesta"
        ariaLabel="Resultado de la respuesta"
        className="answer-actions"
        actionsClassName="answer-buttons"
        actions={[
          {
            label: "Correcta",
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
            label: "Incorrecta",
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
