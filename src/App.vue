<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from "vue";
import SysInfo from "./components/modules/SysInfo.vue";
import SplashScreen from "./components/SplashScreen.vue";
import { useTerminal } from "./composables/useTerminal";

const showSplash = ref(true);
const active = ref<string | null>(null);
const expandedCat = ref<string | null>("recon");
const inputCmd = ref("");
const inputField = ref<HTMLInputElement | null>(null);
const terminalBody = ref<HTMLDivElement | null>(null);

// Ambil state terminal global
const term = useTerminal();
const consoleLogs = term.lines;

interface Tool {
  id: string; code: string; name: string; tagline: string; desc: string;
  cat: "recon" | "exploit" | "manual" | "utility";
}

const tools: Tool[] = [
  { id: "sysinfo", code: "01", name: "sys-info", tagline: "device recon", desc: "Get local OS, arch, and hostname info.", cat: "recon" },
];

const groups = [
  { id: "recon", label: "recon", desc: "passive + active reconnaissance", mark: "◉" },
  { id: "exploit", label: "exploitation", desc: "attack vectors & vulnerability", mark: "⚔" },
  { id: "manual", label: "manual", desc: "hand-crafted request tooling", mark: "✎" },
  { id: "utility", label: "utility", desc: "helpers & payload generation", mark: "⚙" },
];

const groupedTools = computed(() =>
  groups.map(g => ({ ...g, tools: tools.filter(t => t.cat === g.id) }))
);

function scrollToBottom() {
  nextTick(() => {
    if (terminalBody.value) terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
  });
}

// Scroll ke bawah tiap ada log baru dari modul atau command
watch(consoleLogs, () => scrollToBottom(), { deep: true });

function focusInput() { if (inputField.value) inputField.value.focus(); }

function executeCommand(cmdText: string) {
  const cmd = cmdText.trim().toLowerCase();
  if (!cmd) return;

  term.info(`root@sevenbyte:~$ ${cmd}`);
  inputCmd.value = "";

  if (cmd === "clear") {
    term.clear();
  } else if (cmd === "help") {
    term.ok("Available modules:");
    tools.forEach(t => term.dim(`  [${t.code}] ${t.name.padEnd(10)} - ${t.desc}`));
  } else if (cmd === "back") {
    active.value = null;
    term.dim("Returning to arsenal...");
  } else {
    const tool = tools.find(t => t.name === cmd || t.id === cmd);
    if (tool) {
      active.value = tool.id;
      term.info(`> Loading module: ${tool.name}...`);
    } else {
      term.err(`Command not found: '${cmd}'. Type 'help'.`);
    }
  }
}

function handleCommand() { executeCommand(inputCmd.value); }
function openModule(id: string) { 
  term.clear();
  active.value = id; 
}
function goBack() { active.value = null; focusInput(); }
function toggleCategory(catId: string) {
  expandedCat.value = expandedCat.value === catId ? null : catId;
}

onMounted(() => {
  term.info("7Toolkits Terminal v1.0.0");
  term.dim("Type 'help' for commands.");
  setTimeout(focusInput, 500);
});
</script>

<template>
  <SplashScreen v-if="showSplash" @done="showSplash = false" />

  <div class="shell" v-show="!showSplash">
    <header class="hdr">
      <div class="hdr-top">
        <button v-if="active" class="hdr-back" @click="goBack">◀ back</button>
        <div class="banner-wrap">
          <pre class="banner-art">
███████╗████████╗ ██████╗  ██████╗ ██╗     ██╗  ██╗██╗████████╗███████╗       
╚════██║╚══██╔══╝██╔═══██╗██╔═══██╗██║     ██║ ██╔╝██║╚══██╔══╝██╔════╝       
    ██╔╝   ██║   ██║   ██║██║   ██║██║     █████╔╝ ██║   ██║   ███████╗       
   ██╔╝    ██║   ██║   ██║██║   ██║██║     ██╔═██╗ ██║   ██║   ╚════██║       
   ██║     ██║   ╚██████╔╝╚██████╔╝███████╗██║  ██╗██║   ██║   ███████║       
   ╚═╝     ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝
          </pre>
        </div>
      </div>
      <div class="hdr-meta">
        <span class="tag">v1.0.0</span>
        <span class="hdr-spacer" />
        <span class="hdr-status"><span class="pulse" />{{ active ? "armed" : "idle" }}</span>
      </div>
    </header>

    <main class="main">
      <!-- JIKA MODUL AKTIF -->
      <div v-if="active" class="tool">
        <SysInfo v-if="active === 'sysinfo'" />
      </div>
      
      <!-- JIKA MENU UTAMA -->
      <div v-else class="arsenal-view">
        <div class="menu-scroll">
          <div v-for="g in groupedTools" :key="g.id" class="accordion-group">
            <button class="accordion-header" :class="{ active: expandedCat === g.id }" @click="toggleCategory(g.id)">
              <div class="acc-left">
                <span class="grp-mark">{{ g.mark }}</span>
                <span class="grp-label">{{ g.label }}</span>
                <span class="grp-desc">// {{ g.desc }}</span>
              </div>
              <div class="acc-right">
                <span class="grp-count">[{{ g.tools.length }}]</span>
                <span class="acc-arrow">{{ expandedCat === g.id ? '▼' : '▶' }}</span>
              </div>
            </button>
            <div v-if="expandedCat === g.id" class="accordion-body">
              <div v-if="g.tools.length === 0" class="empty-cat">No modules installed in this category.</div>
              <div v-else class="grid">
                <button v-for="t in g.tools" :key="t.id" class="tile" @click="openModule(t.id)">
                  <div class="tile-top"><span class="tile-code">[{{ t.code }}]</span></div>
                  <div class="tile-name">{{ t.name }}</div>
                  <div class="tile-tag">{{ t.tagline }}</div>
                  <div class="tile-desc">{{ t.desc }}</div>
                  <div class="tile-foot"><span class="sev">info</span><span class="tile-arrow">▶</span></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- TERMINAL BAWAH (Selalu ada di semua halaman) -->
    <div class="bottom-terminal">
      <div class="terminal-log" ref="terminalBody">
        <div v-for="(l, i) in consoleLogs" :key="i" class="log-line" :class="`lvl-${l.level}`">
          <span class="ts">{{ l.ts }}</span>
          <span class="pre">{{ l.level === 'valid' ? '[✓]' : l.level === 'err' ? '[x]' : l.level === 'ok' ? '[*]' : l.level === 'dim' ? '[ ]' : '[i]' }}</span>
          {{ l.text }}
        </div>
      </div>
      
      <div class="quick-actions">
        <button v-for="t in tools" :key="t.id" @click="executeCommand(t.name)" class="qa-btn">> {{ t.name }}</button>
        <button @click="executeCommand('help')" class="qa-btn">[ help ]</button>
        <button @click="executeCommand('clear')" class="qa-btn">[ clear ]</button>
      </div>

      <div class="input-area" @click="focusInput">
        <span class="prompt">root@sevenbyte:~$</span>
        <input ref="inputField" v-model="inputCmd" @keyup.enter="handleCommand" type="text" class="cmd-input" spellcheck="false" placeholder="type help..." />
        <button @click="handleCommand" class="send-btn">⏎</button>
      </div>
    </div>

    <footer class="foot">
      <span class="foot-l">7Toolkits v1.0.0 // offensive toolkit</span>
      <span class="foot-r">[Credits: Tegal 1337]</span>
    </footer>
  </div>
</template>

<style scoped>
/* SAMA SEPERTI SEBELUMNYA, DITAMBAH COLOR LOG */
.shell { height: 100%; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); }
.hdr { flex-shrink: 0; border-bottom: 1px solid var(--border); background: var(--bg-elev); }
.hdr-top { display: flex; align-items: flex-start; gap: 8px; padding: 8px 12px 4px; }
.hdr-back { color: var(--alert); border: 1px solid var(--alert); padding: 3px 8px; font-size: 11px; margin-top: 4px; cursor: pointer; background: transparent; }
.banner-wrap { flex: 1; overflow-x: auto; }
.banner-art { color: var(--accent); font-size: 9px; line-height: 1.1; font-weight: 700; text-shadow: 0 0 10px rgba(0, 255, 0, 0.25); margin: 0; white-space: pre; }
.hdr-meta { display: flex; align-items: center; gap: 6px; padding: 0 12px 8px; }
.tag { font-size: 10px; color: var(--fg-dim); padding: 1px 6px; border: 1px solid var(--border); }
.hdr-spacer { flex: 1; }
.hdr-status { display: flex; align-items: center; gap: 5px; font-size: 10px; color: var(--accent); text-transform: uppercase; }
.pulse { width: 6px; height: 6px; background: var(--accent); box-shadow: 0 0 8px var(--accent); animation: pulse 1.5s infinite; }
@keyframes pulse { 50% { opacity: 0.3; } }

.main { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.arsenal-view { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.menu-scroll { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }

.accordion-group { display: flex; flex-direction: column; border: 1px solid var(--border); background: var(--bg-panel); }
.accordion-header { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 10px 12px; background: var(--bg-elev); border: none; cursor: pointer; text-align: left; color: var(--fg); }
.accordion-header:hover { background: var(--border); }
.accordion-header.active { border-bottom: 1px solid var(--border); background: var(--bg); }
.acc-left { display: flex; align-items: center; gap: 8px; }
.acc-right { display: flex; align-items: center; gap: 8px; }
.grp-mark { font-size: 16px; color: var(--info); }
.grp-label { font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; font-size: 13px; color: var(--info); }
.grp-desc { color: var(--fg-ghost); font-size: 10px; font-style: italic; display: none; }
@media (min-width: 400px) { .grp-desc { display: block; } }
.grp-count { color: var(--fg-dim); font-size: 10px; }
.acc-arrow { color: var(--accent); font-size: 10px; }
.accordion-body { padding: 10px 12px; background: var(--bg-panel); }
.empty-cat { color: var(--fg-ghost); font-size: 11px; font-style: italic; text-align: center; padding: 10px; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; }
.tile { display: flex; flex-direction: column; gap: 4px; text-align: left; padding: 10px; background: var(--bg); border: 1px solid var(--border); min-height: 120px; position: relative; cursor: pointer; }
.tile:hover { border-color: var(--accent); }
.tile-top { display: flex; justify-content: space-between; }
.tile-code { color: var(--fg-ghost); font-size: 10px; }
.tile-name { font-size: 14px; font-weight: 700; color: var(--fg); }
.tile-tag { font-size: 9px; color: var(--fg-dim); text-transform: uppercase; }
.tile-desc { font-size: 10px; color: var(--fg-dim); flex: 1; }
.tile-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.sev { font-size: 9px; padding: 1px 4px; border: 1px solid var(--fg-ghost); color: var(--fg-ghost); }
.tile-arrow { color: var(--fg-ghost); font-size: 10px; }

/* TERMINAL */
.bottom-terminal { flex-shrink: 0; background: #09090b; border-top: 1px solid var(--border); padding: 8px 12px; display: flex; flex-direction: column; max-height: 35vh; }
.terminal-log { flex: 1; overflow-y: auto; min-height: 40px; max-height: 100px; display: flex; flex-direction: column; gap: 2px; margin-bottom: 8px; }
.log-line { font-size: 11px; white-space: pre-wrap; line-height: 1.3; display: flex; gap: 6px; }
.log-line .ts { color: var(--fg-ghost); flex-shrink: 0; }
.log-line .pre { flex-shrink: 0; }
.lvl-info { color: var(--fg-dim); }
.lvl-info .pre { color: var(--fg-dim); }
.lvl-ok { color: var(--info); }
.lvl-ok .pre { color: var(--info); }
.lvl-valid { color: var(--valid); }
.lvl-valid .pre { color: var(--valid); }
.lvl-err { color: var(--alert); }
.lvl-err .pre { color: var(--alert); }
.lvl-dim { color: var(--fg-ghost); }
.lvl-dim .pre { color: var(--fg-ghost); }

.quick-actions { display: flex; flex-wrap: wrap; gap: 6px; padding-bottom: 8px; border-bottom: 1px dashed var(--border); margin-bottom: 8px; }
.qa-btn { background: var(--bg-panel); border: 1px solid var(--border); color: var(--accent); font-size: 10px; padding: 3px 8px; cursor: pointer; }
.qa-btn:hover { border-color: var(--accent); }
.input-area { display: flex; align-items: center; gap: 8px; }
.prompt { color: var(--accent); font-size: 12px; font-weight: bold; white-space: nowrap; }
.cmd-input { flex: 1; background: transparent; border: none; outline: none; color: var(--fg); font-size: 13px; font-family: inherit; }
.send-btn { background: var(--bg-panel); border: 1px solid var(--border); color: var(--accent); padding: 4px 10px; font-size: 14px; cursor: pointer; }

.tool { flex: 1; padding: 10px 12px; display: flex; overflow: hidden; }
.foot { flex-shrink: 0; padding: 5px 12px; border-top: 1px solid var(--border); background: var(--bg-elev); font-size: 10px; color: var(--fg-dim); display: flex; justify-content: space-between; }
</style>