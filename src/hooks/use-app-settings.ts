import { useEffect, useState } from "react";

export type TextSize = "normal" | "large" | "xlarge";
export type Contrast = "standard" | "high";

export type AppSettings = { textSize: TextSize; contrast: Contrast };

const STORAGE_KEY = "carenest.display-settings";
const defaults: AppSettings = { textSize: "normal", contrast: "standard" };

let current: AppSettings = defaults;
const listeners = new Set<(s: AppSettings) => void>();

function apply(settings: AppSettings) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  el.dataset["textSize"] = settings.textSize;
  el.dataset["contrast"] = settings.contrast;
}

function read(): AppSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      textSize: parsed.textSize ?? defaults.textSize,
      contrast: parsed.contrast ?? defaults.contrast,
    };
  } catch {
    return defaults;
  }
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(current);

  useEffect(() => {
    current = read();
    apply(current);
    setSettings(current);
    const listener = (s: AppSettings) => setSettings(s);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const update = (patch: Partial<AppSettings>) => {
    current = { ...current, ...patch };
    apply(current);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    } catch {
      /* storage unavailable */
    }
    listeners.forEach((l) => l(current));
  };

  return { settings, update };
}
