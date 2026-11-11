<script setup lang="ts">
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { useTerminal } from "../../composables/useTerminal";

const log = useTerminal();
const running = ref(false);

async function run() {
  if (running.value) return;
  running.value = true;
  log.info("fetching device info...");
  log.dim("calling rust backend...");

  try {
    const info: any = await invoke("get_sys_info");
    log.valid(`OS      : ${info.os}`);
    log.valid(`ARCH    : ${info.arch}`);
    log.valid(`HOST    : ${info.hostname}`);
    log.ok("done.");
  } catch (e: any) {
    log.err(String(e));
  } finally {
    running.value = false;
  }
}
</script>

<template>
  <div class="module">
    <div class="form">
      <button class="exec" :disabled="running" @click="run">
        {{ running ? "[ fetching... ]" : "> execute sys-info" }}
      </button>
    </div>
    <div class="info-text">
      Output logs will appear in the terminal (click the green button).
    </div>
  </div>
</template>

<style scoped>
.module { display: flex; flex-direction: column; gap: 10px; height: 100%; padding: 10px; }
.form { display: flex; flex-direction: column; gap: 6px; }
.exec { border: 1px solid var(--accent); color: var(--accent); background: transparent; padding: 12px; font-weight: 500; letter-spacing: 0.05em; text-transform: lowercase; transition: all 0.15s; }
.exec:hover:not(:disabled) { background: var(--accent); color: var(--bg); border-color: var(--accent); box-shadow: 0 0 16px rgba(0, 255, 0, 0.35); }
.exec:disabled { color: var(--fg-dim); border-color: var(--border-hot); cursor: wait; }
.info-text { color: var(--fg-ghost); font-size: 11px; font-style: italic; text-align: center; margin-top: 20px; }
</style>