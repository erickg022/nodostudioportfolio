"use client";

import { useEffect, useRef, useState } from "react";
import {
  leadRoles,
  preregConsentText,
  preregExperience,
  preregModality,
  preregSource,
  preregTools,
} from "@/data/lead-options";

type Props = {
  courseSlug: string;
  courseTitle: string;
};

type Step = "contact" | "profile" | "done";

const errorCopy: Record<string, string> = {
  name: "Escribe tu nombre.",
  email: "Revisa tu correo, parece incompleto.",
  consent: "Marca la casilla para poder preregistrarte.",
  rate_limited: "Demasiados intentos. Prueba de nuevo en unos minutos.",
  not_configured: "El preregistro no está disponible en este momento. Intenta de nuevo más tarde.",
};

export function PreregForm({ courseSlug, courseTitle }: Props) {
  const openedAt = useRef(0);
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);
  const [step, setStep] = useState<Step>("contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [modality, setModality] = useState("");
  const [tools, setTools] = useState<string[]>([]);
  const [source, setSource] = useState("");
  const [country, setCountry] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError(errorCopy.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError(errorCopy.email);
    setError("");
    setStep("profile");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return setError(errorCopy.consent);
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "prereg",
          course: courseSlug,
          name,
          email,
          role,
          experience,
          modality,
          tools,
          source,
          country,
          consent,
          website,
          elapsed: Date.now() - openedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(errorCopy[data.error ?? ""] ?? "No pudimos guardar tu preregistro. Intenta de nuevo en un momento.");
        if (data.error === "name" || data.error === "email") setStep("contact");
        return;
      }
      setStep("done");
    } catch {
      setError("Sin conexión. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const toggleTool = (t: string) => setTools((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const chip = (on: boolean) => `cx-pf__chip${on ? " is-on" : ""}`;

  if (step === "done") {
    return (
      <div className="cx-pf" role="status">
        <h4 className="cx-pf__h">Listo, {name.trim().split(" ")[0]}</h4>
        <p className="cx-pf__p">
          Quedaste preregistrado/a en <strong>{courseTitle}</strong>. No se cobra nada hoy: cuando haya suficientes
          interesados definimos las fechas y te escribimos al correo.
        </p>
      </div>
    );
  }

  return (
    <div className="cx-pf">
      <p className="cx-pf__step cx-mono">Preregistro · {step === "contact" ? "1" : "2"}/2</p>

      {step === "contact" && (
        <form onSubmit={next} noValidate>
          <h4 className="cx-pf__h">¿A dónde te escribimos?</h4>
          <label className="cx-pf__field">
            <span className="cx-pf__label cx-mono">Nombre</span>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              autoComplete="name"
              placeholder="Tu nombre"
            />
          </label>
          <label className="cx-pf__field">
            <span className="cx-pf__label cx-mono">Correo</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              autoComplete="email"
              placeholder="tu@correo.com"
            />
          </label>
          {error && (
            <p role="alert" className="cx-pf__err">
              {error}
            </p>
          )}
          <button type="submit" className="cx-pf__btn">
            Continuar <span aria-hidden="true">→</span>
          </button>
        </form>
      )}

      {step === "profile" && (
        <form onSubmit={submit} noValidate>
          <h4 className="cx-pf__h">Cuéntanos de ti</h4>
          <p className="cx-pf__p">Así adaptamos el workshop. Todo es opcional menos la casilla final.</p>

          <fieldset className="cx-pf__set">
            <legend className="cx-pf__label cx-mono">¿A qué te dedicas?</legend>
            <div className="cx-pf__chips">
              {leadRoles.map((r) => (
                <button key={r} type="button" aria-pressed={role === r} className={chip(role === r)} onClick={() => setRole(role === r ? "" : r)}>
                  {r}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="cx-pf__set">
            <legend className="cx-pf__label cx-mono">¿Cuánta experiencia tienes con IA?</legend>
            <div className="cx-pf__chips">
              {preregExperience.map((x) => (
                <button key={x} type="button" aria-pressed={experience === x} className={chip(experience === x)} onClick={() => setExperience(experience === x ? "" : x)}>
                  {x}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="cx-pf__set">
            <legend className="cx-pf__label cx-mono">¿Cómo te gustaría tomarlo?</legend>
            <div className="cx-pf__chips">
              {preregModality.map((x) => (
                <button key={x} type="button" aria-pressed={modality === x} className={chip(modality === x)} onClick={() => setModality(modality === x ? "" : x)}>
                  {x}
                </button>
              ))}
            </div>
            <p className="cx-pf__hint">Aún estamos definiendo fechas y formato. Tu respuesta nos ayuda a decidir.</p>
          </fieldset>

          <fieldset className="cx-pf__set">
            <legend className="cx-pf__label cx-mono">¿Qué herramientas ya tienes? (elige las que quieras)</legend>
            <div className="cx-pf__chips">
              {preregTools.map((x) => (
                <button key={x} type="button" aria-pressed={tools.includes(x)} className={chip(tools.includes(x))} onClick={() => toggleTool(x)}>
                  {x}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="cx-pf__set">
            <legend className="cx-pf__label cx-mono">¿Cómo nos conociste?</legend>
            <div className="cx-pf__chips">
              {preregSource.map((x) => (
                <button key={x} type="button" aria-pressed={source === x} className={chip(source === x)} onClick={() => setSource(source === x ? "" : x)}>
                  {x}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="cx-pf__field">
            <span className="cx-pf__label cx-mono">País y ciudad</span>
            <input value={country} onChange={(e) => setCountry(e.target.value)} autoComplete="country-name" placeholder="México, Guadalajara" />
          </label>

          {/* Honeypot: hidden from people, bots fill it. */}
          <div aria-hidden="true" className="cx-pf__trap">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </label>
          </div>

          <label className="cx-pf__consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>{preregConsentText}</span>
          </label>

          {error && (
            <p role="alert" className="cx-pf__err">
              {error}
            </p>
          )}
          <div className="cx-pf__actions">
            <button type="submit" className="cx-pf__btn" disabled={busy}>
              {busy ? "Enviando..." : "Preregistrarme"} <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="cx-pf__back cx-mono" onClick={() => setStep("contact")}>
              Atrás
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
