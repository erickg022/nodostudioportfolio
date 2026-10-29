"use client";

import { useEffect } from "react";
import { initMeridian } from "./runtime";

/** Attaches the Meridian runtime (WebGL, scroll, overlay) to the server-rendered markup. */
export function MeridianRuntime() {
  useEffect(() => initMeridian(), []);
  return null;
}
