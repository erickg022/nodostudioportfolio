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

/** Workshop preregistration (/cursos). */
export const preregExperience = [
  "Nunca la he usado",
  "La uso de vez en cuando",
  "La uso seguido en mi trabajo",
  "Ya hago renders o video con IA",
] as const;

export const preregModality = [
  "En vivo online",
  "Grabado, a mi ritmo",
  "Presencial",
  "Me da igual",
] as const;

export const preregTools = ["ChatGPT", "Claude", "Magnific AI", "Midjourney", "Ninguna"] as const;

export const preregSource = ["TikTok", "Instagram", "Recomendación", "Otro"] as const;

export const preregConsentText =
  "Acepto que Nodo Studio me escriba sobre este workshop, sus fechas y novedades. Puedo darme de baja en cualquier momento.";
