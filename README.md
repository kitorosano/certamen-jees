# Certamen JeeS 2026

Panel web para presentar preguntas y contenidos del Certamen JeeS 2026. La aplicación carga entradas en vivo desde una hoja de cálculo, permite seleccionar el tipo y el identificador de una entrada, y sincroniza una vista de presentación independiente para proyectarla durante el certamen.

## Características principales

- Panel de control en español para seleccionar y mostrar entradas.
- Formulario interactivo en React con autocompletado separado para memoria y esgrima bíblico.
- Tres tipos de contenido:
  - **Preguntas**: pregunta con respuestas posibles mezcladas.
  - **Versículos de memoria**: cita para presentar.
  - **Esgrima bíblico**: cita para presentar.
- Datos cargados en tiempo real mediante `astro-sheet-loader` desde las hojas `Preguntas`, `Memorias` y `Esgrimas`.
- Vista de presentación en formato oscuro y apta para proyección.
- Comunicación entre el panel y la vista mediante `BroadcastChannel`, sin necesidad de refrescar la pantalla.
- Acciones visuales para marcar una respuesta como correcta o incorrecta:
  - Confeti y pulso verde para respuestas correctas.
  - Superposición roja para respuestas incorrectas.
- Endpoint HTTP para consultar una entrada por tipo e identificador.
- Adaptador oficial de Vercel para producción.

## Requisitos

- [Node.js](https://nodejs.org/) `22.12` o superior.
- [pnpm](https://pnpm.io/) habilitado en el entorno local.
- Acceso a la hoja de cálculo configurada en [`src/live.config.ts`](./src/live.config.ts). La hoja debe conservar las pestañas y columnas esperadas por los esquemas de validación.

## Instalación y desarrollo

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/kitorosano/certamen-jees.git
cd certamen-jees
pnpm install
```

Inicia el servidor de desarrollo:

```bash
pnpm dev
```

Abre [http://localhost:4321](http://localhost:4321). También puedes iniciar Astro y especificar el puerto:

```bash
pnpm astro dev --host 0.0.0.0 --port 4321
```

## Uso básico

1. Abre la página principal en [http://localhost:4321](http://localhost:4321).
2. Pulsa **Abrir previsualización** para abrir `/preview` en otra pestaña o ventana. Esta vista es la que se puede proyectar.
3. En el panel, selecciona **Pregunta**, **Versículo de Memoria** o **Esgrima Bíblico**.
4. Introduce el identificador de la entrada y pulsa **Mostrar**. Para **Versículo de Memoria** y **Esgrima Bíblico**, escribe o selecciona la cita bíblica (por ejemplo, `Juan 3:16`) usando el autocompletado.
5. Usa **Correcta** o **Incorrecta** para mostrar el efecto visual correspondiente.
6. Pulsa **Limpiar pantalla** antes de presentar la siguiente entrada.

La vista de previsualización también puede abrirse directamente en `/preview`, aunque debe existir una ventana del panel abierta para enviarle contenido.

## Rutas y API

| Ruta | Propósito |
| --- | --- |
| `/` | Panel de control y previsualización integrada. |
| `/preview` | Vista independiente para la presentación. |
| `/api/questions/:type/:id` | Devuelve una entrada JSON validada. |

Los valores válidos para `:type` son `questions`, `memories` y `swordplays`. Por ejemplo:

```bash
curl http://localhost:4321/api/questions/questions/1
```

Una respuesta exitosa contiene un objeto con esta forma:

```json
{
  "type": "questions",
  "id": 1,
  "title": "Texto de la pregunta",
  "answers": [
    "Respuesta posible 1",
    "Respuesta posible 2"
  ]
}
```

El endpoint devuelve `400` para tipos o identificadores inválidos, `404` si no existe la entrada y `502` si falla la carga de datos.

## Comandos disponibles

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo en `localhost:4321`. |
| `pnpm build` | Genera la compilación de producción en `dist/`. |
| `pnpm preview` | Sirve localmente la compilación generada. |
| `pnpm astro ...` | Ejecuta comandos de la CLI de Astro. |

Para verificar una compilación de producción:

```bash
pnpm build
pnpm preview
```

## Estructura del proyecto

```text
.
├── public/                 # Recursos estáticos y favicon
├── src/
│   ├── components/         # Panel de control y tarjeta de previsualización
│   ├── layouts/            # Layouts del panel y de la presentación
│   ├── pages/              # Rutas de Astro y endpoint de preguntas
│   ├── constants.ts        # Tipos de contenido, canal y tiempos de efectos
│   ├── live.config.ts      # Colecciones y conexión con Google Sheets
│   └── types.ts            # Tipos de preguntas y eventos
├── astro.config.mjs        # Salida server y adaptador de Vercel
└── package.json             # Scripts y dependencias
```

## Despliegue

El proyecto está configurado para generar una aplicación server-rendered compatible con Vercel:

```bash
pnpm build
```

Para desplegar en Vercel, importa el repositorio desde el [panel de Vercel](https://vercel.com/new) y usa los valores predeterminados de Astro. Asegúrate de que el entorno de despliegue pueda leer la hoja de cálculo configurada antes de publicar.

## Soporte y mantenimiento

Para reportar un problema o solicitar un cambio, abre un [issue en GitHub](https://github.com/kitorosano/certamen-jees/issues). El repositorio y su historial de cambios están disponibles en [kitorosano/certamen-jees](https://github.com/kitorosano/certamen-jees).
