import { QuestionTypes, type Translation } from "@types";

export const es = {
  brand: "Certamen JeeS {{year}}",
  api: {
    "400": "Tipo o identificador inválido.",
    "404": "No se encontró la pregunta solicitada.",
    "502": "No se pudo cargar la pregunta.",
  },
  panel: {
    title: "¿Qué pregunta quieres mostrar?",
    form: {
      types: {
        [QuestionTypes.QUESTION]: "Pregunta",
        [QuestionTypes.MEMORY]: "Versículo de Memoria",
        [QuestionTypes.SWORDPLAY]: "Esgrima Bíblico",
      },
      input: {
        placeholder_question: "Ej: 13",
        placeholder_verse: "Ej. Juan 3:16",
      },
      button: {
        submit: "Mostrar",
        loading: "Cargando...",
      },
      status: {
        default: "Abre la previsualización para comenzar.",
        ready: "Ingresa un número de pregunta.",
        verse: "Selecciona una cita bíblica de la lista.",
        error:
          "El navegador bloqueó la pestaña. Permite ventanas emergentes e inténtalo de nuevo.",
        loading: "Cargando entrada...",
        showing_questions: "Mostrando la pregunta #{{id}}",
        showing_memories: "Mostrando la cita bíblica",
        showing_swordplays: "Mostrando la cita bíblica",
        cleared: "Pantalla limpiada.",
      },
      preview_action_title: "Controles de presentación",
      effect_action_title: "Resultado de la respuesta",
      actions: {
        open: "Abrir previsualización",
        clear: "Limpiar pantalla",
        correct: "Correcta",
        incorrect: "Incorrecta",
      },
    },
    preview: {
      subtitle: "Previsualización",
      status: {
        disconnected: "Desconectado",
        connected: "Vista en vivo",
      },
    },
  },
  preview: {
    waiting: "",
  },
  errors: {
    entries: "No se pudieron cargar las entradas de memoria y swordplay.",
    entry: "No se pudo cargar la entrada.",
  },
  "404": {
    code: "Error 404",
    title: "Esta pregunta no existe",
    description:
      "Parece que te has salido del temario. La página que buscas no está aquí, pero todavía puedes volver al juego.",
    home: "Volver al inicio",
    back: "Volver atrás",
    note: "A veces perderse también es parte del certamen.",
  },
} satisfies Translation;
