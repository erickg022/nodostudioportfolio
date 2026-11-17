/** Options for the lead form on /recursos. Shared by the form (client) and the API route (server). */

export const leadRoles = [
  "Arquitecto/a",
  "Diseñador/a de interiores",
  "Estudiante",
  "Creativo/a o director/a",
  "Fotógrafo/a o videógrafo/a",
  "Marketing o agencia",
  "Desarrollador/a",
  "Otro",
] as const;

export const leadInterests = [
  "Renders hiperrealistas",
  "Tours inmersivos",
  "Video con IA",
  "Campañas con IA",
  "Creative technology",
  "Otro",
] as const;

export const leadConsentText =
  "Acepto recibir correos de Nodo Studio sobre recursos y workshops. Puedo darme de baja en cualquier momento.";
