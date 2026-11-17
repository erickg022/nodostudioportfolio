"use client";

import { useRef, useState } from "react";
import { leadConsentText, leadInterests, leadRoles } from "@/data/lead-options";

type Props = {
  slug: string;
  title: string;
  href: string;
  download?: string;
  cta: string;
  /** When false the button downloads directly (no lead capture). */
  enabled: boolean;
  className: string;
};

type Step = "details" | "profile" | "done";

const inputClass =
  "mt-2 w-full border-0 border-b border-black/25 bg-transparent py-3 text-lg text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[var(--accent)]";
const labelClass = "block font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500";
const primaryBtn =
  "inline-flex items-center border border-neutral-950 bg-neutral-950 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white transition hover:border-[var(--accent)] hover:bg-[var(--accent)] disabled:opacity-50";

const errorCopy: Record<string, string> = {
  name: "Escribe tu nombre.",
  email: "Revisa tu correo, parece incompleto.",
  consent: "Marca la casilla para poder enviarte el recurso y novedades.",
  rate_limited: "Demasiados intentos. Prueba de nuevo en unos minutos.",
};

export function LeadDownload({ slug, title, href, download, cta, enabled, className }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const openedAt = useRef(0);

  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const linkProps = download ? { download } : { target: "_blank", rel: "noopener noreferrer" };

  if (!enabled) {
    return (
      <a href={href} {...linkProps} className={className}>
        {cta}
        <span aria-hidden="true" className="ml-3">-&gt;</span>
      </a>
    );
  }

  const open = () => {
    setStep("details");
    setError("");
    openedAt.current = Date.now();
    dialogRef.current?.showModal();
  };

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
          name,
          email,
          country,
          role,
          interests,
          consent,
          website,
          resource: slug,
          elapsed: Date.now() - openedAt.current,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(errorCopy[data.error ?? ""] ?? "No pudimos guardar tus datos. Intenta de nuevo en un momento.");
        if (data.error === "name" || data.error === "email") setStep("details");
        return;
      }
      setStep("done");
      window.setTimeout(() => downloadRef.current?.click(), 400);
    } catch {
      setError("Sin conexión. Intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const chip = (active: boolean) =>
    `border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] transition ${
      active
        ? "border-neutral-950 bg-neutral-950 text-white"
        : "border-black/20 text-neutral-700 hover:border-[var(--accent)] hover:text-[var(--accent)]"
    }`;

  return (
    <>
      <button type="button" onClick={open} className={className}>
        {cta}
        <span aria-hidden="true" className="ml-3">-&gt;</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`Descargar ${title}`}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[min(600px,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto border border-black/20 bg-white p-0 text-neutral-950 backdrop:bg-black/50"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500">
            {step === "done" ? "Listo" : `Descarga gratis · ${step === "details" ? "1" : "2"}/2`}
          </p>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="font-mono text-[11px] uppercase tracking-[0.18em] hover:text-[var(--accent)]"
          >
            Cerrar [x]
          </button>
        </div>

        {step === "details" && (
          <form onSubmit={next} className="px-6 py-8" noValidate>
            <h3 className="text-4xl uppercase leading-none sm:text-5xl">¿A dónde te lo enviamos?</h3>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              Déjanos tu nombre y correo para empezar la descarga.
            </p>

            <label className="mt-8 block">
              <span className={labelClass}>Nombre</span>
              <input
                className={inputClass}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Tu nombre"
                autoFocus
              />
            </label>
            <label className="mt-6 block">
              <span className={labelClass}>Correo</span>
              <input
                className={inputClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="tu@correo.com"
              />
            </label>

            {error && <p role="alert" className="mt-5 text-sm text-[var(--accent)]">{error}</p>}
            <button type="submit" className={`${primaryBtn} mt-8`}>
              Continuar <span aria-hidden="true" className="ml-3">-&gt;</span>
            </button>
          </form>
        )}

        {step === "profile" && (
          <form onSubmit={submit} className="px-6 py-8" noValidate>
            <h3 className="text-4xl uppercase leading-none sm:text-5xl">Cuéntanos de ti</h3>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              Así te enviamos lo que sí te sirve. Todo es opcional menos la casilla final.
            </p>

            <label className="mt-8 block">
              <span className={labelClass}>País y ciudad</span>
              <input
                className={inputClass}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                autoComplete="country-name"
                placeholder="México, Guadalajara"
              />
            </label>

            <fieldset className="mt-8">
              <legend className={labelClass}>¿A qué te dedicas?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {leadRoles.map((r) => (
                  <button key={r} type="button" aria-pressed={role === r} onClick={() => setRole(role === r ? "" : r)} className={chip(role === r)}>
                    {r}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className={labelClass}>¿Qué te gustaría aprender? (elige las que quieras)</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {leadInterests.map((i) => (
                  <button key={i} type="button" aria-pressed={interests.includes(i)} onClick={() => toggleInterest(i)} className={chip(interests.includes(i))}>
                    {i}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Honeypot: hidden from people, bots fill it. */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </label>
            </div>

            <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-neutral-700">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)]"
              />
              <span>{leadConsentText}</span>
            </label>

            {error && <p role="alert" className="mt-5 text-sm text-[var(--accent)]">{error}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="submit" disabled={busy} className={primaryBtn}>
                {busy ? "Enviando..." : "Descargar PDF"} <span aria-hidden="true" className="ml-3">-&gt;</span>
              </button>
              <button
                type="button"
                onClick={() => setStep("details")}
                className="font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-950"
              >
                Atrás
              </button>
            </div>
          </form>
        )}

        {step === "done" && (
          <div className="px-6 py-10">
            <h3 className="text-4xl uppercase leading-none sm:text-5xl">Gracias, {name.trim().split(" ")[0]}</h3>
            <p className="mt-4 text-lg leading-relaxed text-neutral-700">
              Tu descarga ya empezó. Si no se inició, usa el botón de abajo.
            </p>
            <a
              ref={downloadRef}
              href={href}
              {...linkProps}
              className="mt-6 inline-flex border border-black/20 px-5 py-4 font-mono text-[11px] uppercase tracking-[0.18em] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Descargar PDF <span aria-hidden="true" className="ml-3">-&gt;</span>
            </a>
          </div>
        )}
      </dialog>
    </>
  );
}
