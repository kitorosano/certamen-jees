export function Response400(): Response {
  return Response.json(
    { error: "Tipo o identificador inválido." },
    { status: 400 },
  );
}

export function Response404(): Response {
  return Response.json(
    { error: "No se encontró la pregunta solicitada." },
    { status: 404 },
  );
}

export function Response502(): Response {
  return Response.json(
    { error: "No se pudo cargar la pregunta." },
    { status: 502 },
  );
}
