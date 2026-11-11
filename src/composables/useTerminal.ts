import { ref } from "vue";

export interface LogLine {
  ts: string;
  level: "info" | "ok" | "warn" | "err" | "valid" | "hit" | "dim";
  text: string;
}

export function useTerminal() {
  const lines = ref<LogLine[]>([]);

  function add(level: LogLine["level"], text: string) {
    const ts = new Date().toTimeString().slice(0, 8);
    lines.value.push({ ts, level, text });
  }

  return {
    lines,
    info: (t: string) => add("info", t),
    ok: (t: string) => add("ok", t),
    warn: (t: string) => add("warn", t),
    err: (t: string) => add("err", t),
    valid: (t: string) => add("valid", t),
    hit: (t: string) => add("hit", t),
    dim: (t: string) => add("dim", t),
    clear: () => { lines.value = []; },
  };
}