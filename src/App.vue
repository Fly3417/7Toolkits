<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import SysInfo from "./components/modules/SysInfo.vue";
import SplashScreen from "./components/SplashScreen.vue";
import { useTerminal } from "./composables/useTerminal";

const showSplash = ref(true);
const activeTool = ref<string | null>(null);
const searchQuery = ref("");
const showTerminal = ref(false);
const inputCmd = ref("");
const term = useTerminal();

const categories = [
  { id: "recon", label: "Recon", mark: "◉" },
  { id: "exploit", label: "Exploit", mark: "⚔" },
  { id: "manual", label: "Manual", mark: "✎" },
  { id: "utility", label: "Utility", mark: "⚙" },
];

const tools = [
  { id: "sysinfo", name: "sys-info", desc: "Device recon info", cat: "recon" },
];

const filteredTools = computed(() => {
  return tools.filter(t => 
    (t.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
     t.desc.toLowerCase().includes(searchQuery.value.toLowerCase()))
  );
});

function openTool(id: string) { 
  term.clear();
  activeTool.value = id; 
}
function closeTool() { activeTool.value = null; }

function executeCommand() {
  const cmd = inputCmd.value.trim().toLowerCase();
  if (!cmd) return;
  term.info(`root@sevenbyte:~$ ${cmd}`);
  inputCmd.value = "";
  
  if (cmd === "clear") term.clear();
  else if (cmd === "help") term.ok("Commands: help, clear, back, sys-info");
  else if (cmd === "back") showTerminal.value = false;
  else {
    const found = tools.find(t => t.name === cmd);
    if (found) { openTool(found.id); showTerminal.value = false; }
    else term.err(`Command not found: ${cmd}`);
  }
}

onMounted(() => {
  setTimeout(() => {
    term.info("Welcome to 7Toolkits v1.0");
    term.dim("Click the terminal button to type commands.");
  }, 1000);
});
</script>

<template>
  <SplashScreen v-if="showSplash" :modules="tools" @done="showSplash = false" />

  <div class="app-shell" v-show="!showSplash">
    <header class="top-header">
      <div class="brand">7Toolkits</div>
      <div class="search-box">
        <input v-model="searchQuery" type="text" placeholder="Search modules..." />
      </div>
    </header>

    <div class="tabs-scroll" v-if="!activeTool">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        class="tab-btn"
        :class="{ active: searchQuery ? true : false }"
        @click="searchQuery = ''"
      >
        {{ cat.mark }} {{ cat.label }}
      </button>
    </div>

    <main class="main-content">
      <div v-if="activeTool" class="active-view">
        <button class="back-btn" @click="closeTool">◀ back</button>
        <SysInfo v-if="activeTool === 'sysinfo'" />
      </div>

      <div v-else class="list-view">
        <div class="list-item" @click="term.warn('File Manager coming soon!')">
          <div class="item-icon archived">📁</div>
          <div class="item-text">
            <div class="item-title">Arsip</div>
            <div class="item-sub">File Manager & APK Tools</div>
          </div>
        </div>

        <div v-for="tool in filteredTools" :key="tool.id" class="list-item" @click="openTool(tool.id)">
          <div class="item-icon module">⚡</div>
          <div class="item-text">
            <div class="item-title">{{ tool.name }}</div>
            <div class="item-sub">{{ tool.desc }}</div>
          </div>
        </div>
      </div>
    </main>

    <button class="fab-terminal" @click="showTerminal = !showTerminal">
      <span class="terminal-icon">&gt;_</span>
    </button>

    <div v-if="showTerminal" class="terminal-overlay">
      <div class="terminal-header">
        <span>Terminal</span>
        <button @click="showTerminal = false">✕</button>
      </div>
      <div class="terminal-body">
        <div v-for="(l, i) in term.lines.value" :key="i" class="term-line" :class="`lvl-${l.level}`">
          <span class="pre">></span> {{ l.text }}
        </div>
      </div>
      <div class="terminal-input">
        <span class="prompt">$</span>
        <input v-model="inputCmd" @keyup.enter="executeCommand" type="text" placeholder="type 'help'..." />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-shell { height: 100%; display: flex; flex-direction: column; background: #0d1117; color: #c9d1d9; font-family: monospace; }
.top-header { padding: 12px 16px; background: #161b22; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #30363d; }
.brand { font-weight: 700; font-size: 18px; color: #00FF00; }
.search-box { flex: 1; background: #0d1117; border: 1px solid #30363d; padding: 6px 12px; }
.search-box input { background: transparent; border: none; outline: none; color: #c9d1d9; width: 100%; font-size: 13px; font-family: monospace; }
.tabs-scroll { display: flex; gap: 8px; padding: 10px 16px; background: #0d1117; overflow-x: auto; border-bottom: 1px solid #30363d; }
.tab-btn { background: #161b22; border: 1px solid #30363d; color: #8b949e; padding: 6px 14px; font-size: 12px; cursor: pointer; white-space: nowrap; }
.tab-btn.active { border-color: #bc8cff; color: #bc8cff; }
.main-content { flex: 1; overflow-y: auto; }
.list-view { padding: 12px; }
.list-item { display: flex; align-items: center; gap: 12px; padding: 12px; cursor: pointer; border-bottom: 1px solid #30363d; }
.list-item:hover { background: #161b22; }
.item-icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
.item-icon.archived { background: #30363d; }
.item-icon.module { background: #21262d; border: 1px solid #00FF00; }
.item-text { flex: 1; }
.item-title { font-size: 14px; font-weight: 600; color: #c9d1d9; }
.item-sub { font-size: 11px; color: #8b949e; margin-top: 2px; }
.fab-terminal { position: absolute; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 50%; background: #161b22; border: 1px solid #00FF00; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(0, 255, 0, 0.2); cursor: pointer; z-index: 100; }
.terminal-icon { color: #00FF00; font-size: 20px; font-weight: bold; }
.terminal-overlay { position: fixed; inset: 0; background: #0d1117; z-index: 999; display: flex; flex-direction: column; }
.terminal-header { display: flex; justify-content: space-between; padding: 12px 16px; background: #161b22; color: #00FF00; border-bottom: 1px solid #30363d; }
.terminal-header button { background: none; border: none; color: #ff7b72; font-size: 18px; cursor: pointer; }
.terminal-body { flex: 1; padding: 16px; overflow-y: auto; }
.term-line { color: #c9d1d9; font-size: 12px; margin-bottom: 4px; }
.term-line .pre { color: #00FF00; margin-right: 8px; }
.lvl-err { color: #ff7b72; }
.lvl-ok { color: #79c0ff; }
.lvl-warn { color: #d29922; }
.terminal-input { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #161b22; border-top: 1px solid #30363d; }
.prompt { color: #00FF00; font-weight: bold; }
.terminal-input input { flex: 1; background: transparent; border: none; outline: none; color: #c9d1d9; font-family: monospace; font-size: 13px; }
.active-view { padding: 16px; height: 100%; overflow-y: auto; }
.back-btn { background: transparent; border: 1px solid #00FF00; color: #00FF00; padding: 6px 12px; margin-bottom: 16px; cursor: pointer; font-size: 12px; }
</style>