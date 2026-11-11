<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from "vue";
import SysInfo from "./components/modules/SysInfo.vue";
import SplashScreen from "./components/SplashScreen.vue";
import { useTerminal } from "./composables/useTerminal";

const showSplash = ref(true);
const activeTool = ref<string | null>(null);
const activeTab = ref("recon");
const searchQuery = ref("");
const showTerminal = ref(false);
const inputCmd = ref("");
const term = useTerminal();

const categories = [
  { id: "recon", label: "Recon", icon: "🔍" },
  { id: "exploit", label: "Exploit", icon: "⚔️" },
  { id: "manual", label: "Manual", icon: "✍️" },
  { id: "utility", label: "Utility", icon: "⚙️" },
];

const tools = [
  { id: "sysinfo", name: "sys-info", desc: "Device recon info", cat: "recon" },
];

const filteredTools = computed(() => {
  return tools.filter(t => 
    (t.cat === activeTab || searchQuery.value) && 
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
  else if (cmd === "help") {
    term.ok("Commands: help, clear, back, sys-info");
  } else if (cmd === "back") {
    showTerminal.value = false;
  } else {
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
  <SplashScreen v-if="showSplash" @done="showSplash = false" />

  <div class="app-shell" v-show="!showSplash">
    <!-- 1. TOP HEADER (Search Bar) -->
    <header class="top-header">
      <div class="brand">7Toolkits</div>
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input v-model="searchQuery" type="text" placeholder="Search modules or files..." />
      </div>
    </header>

    <!-- 2. TABS KATEGORI -->
    <div class="tabs-scroll" v-if="!activeTool">
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        class="tab-btn"
        :class="{ active: activeTab === cat.id }"
        @click="activeTab = cat.id"
      >
        {{ cat.icon }} {{ cat.label }}
      </button>
    </div>

    <!-- 3. KONTEN -->
    <main class="main-content">
      <div v-if="activeTool" class="active-view">
        <button class="back-btn" @click="closeTool">◀ Kembali ke Menu</button>
        <SysInfo v-if="activeTool === 'sysinfo'" />
      </div>

      <div v-else class="list-view">
        <div class="list-item" @click="term.warn('File Manager coming soon!')">
          <div class="item-icon archived">🗂️</div>
          <div class="item-text">
            <div class="item-title">Arsip</div>
            <div class="item-sub">File Manager & APK Tools</div>
          </div>
        </div>

        <div v-for="tool in filteredTools" :key="tool.id" class="list-item" @click="openTool(tool.id)">
          <div class="item-icon module">📦</div>
          <div class="item-text">
            <div class="item-title">{{ tool.name }}</div>
            <div class="item-sub">{{ tool.desc }}</div>
          </div>
        </div>
        
        <div v-if="filteredTools.length === 0" class="empty-state">
          Tidak ada modul di kategori ini.
        </div>
      </div>
    </main>

    <!-- 4. FAB TERMINAL -->
    <button class="fab-terminal" @click="showTerminal = !showTerminal">
      <span class="terminal-icon">&gt;_</span>
    </button>

    <!-- 5. TERMINAL OVERLAY -->
    <div v-if="showTerminal" class="terminal-overlay">
      <div class="terminal-header">
        <span>7Toolkits Terminal</span>
        <button @click="showTerminal = false">✕</button>
      </div>
      <div class="terminal-body">
        <div v-for="(l, i) in term.lines.value" :key="i" class="term-line" :class="`lvl-${l.level}`">
          <span class="pre">></span> {{ l.text }}
        </div>
      </div>
      <div class="terminal-input">
        <span class="prompt">root@7byte:~$</span>
        <input v-model="inputCmd" @keyup.enter="executeCommand" type="text" placeholder="type 'help'..." />
      </div>
    </div>

    <!-- 6. BOTTOM NAVIGATION -->
    <nav class="bottom-nav">
      <div class="nav-item active">
        <span class="nav-icon">💬</span>
        <span class="nav-label">Menu</span>
      </div>
      <div class="nav-item" @click="term.warn('Update system coming soon')">
        <span class="nav-icon">🔄</span>
        <span class="nav-label">Update</span>
      </div>
      <div class="nav-item" @click="term.warn('Community coming soon')">
        <span class="nav-icon">👥</span>
        <span class="nav-label">Community</span>
      </div>
      <div class="nav-item" @click="showTerminal = true">
        <span class="nav-icon">📞</span>
        <span class="nav-label">Terminal</span>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.app-shell { height: 100%; display: flex; flex-direction: column; background: #0b141a; color: #e9edef; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.top-header { padding: 12px 16px; background: #202c33; display: flex; align-items: center; gap: 12px; }
.brand { font-weight: 700; font-size: 20px; color: #00a884; }
.search-box { flex: 1; background: #2a3942; border-radius: 8px; display: flex; align-items: center; padding: 6px 12px; }
.search-box input { background: transparent; border: none; outline: none; color: #e9edef; width: 100%; margin-left: 8px; font-size: 14px; }
.tabs-scroll { display: flex; gap: 8px; padding: 10px 16px; background: #111b21; overflow-x: auto; }
.tab-btn { background: #202c33; border: none; color: #8696a0; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.tab-btn.active { background: #00a884; color: #111b21; }
.main-content { flex: 1; overflow-y: auto; }
.list-view { padding-bottom: 80px; }
.list-item { display: flex; align-items: center; gap: 16px; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #202c33; }
.list-item:hover { background: #202c33; }
.item-icon { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.item-icon.archived { background: #3b4a54; }
.item-icon.module { background: #005c4b; }
.item-text { flex: 1; }
.item-title { font-size: 16px; font-weight: 600; }
.item-sub { font-size: 13px; color: #8696a0; margin-top: 2px; }
.empty-state { text-align: center; padding: 40px; color: #8696a0; font-size: 14px; }
.fab-terminal { position: absolute; bottom: 80px; right: 20px; width: 60px; height: 60px; border-radius: 50%; background: #00a884; border: none; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 168, 132, 0.4); cursor: pointer; z-index: 100; }
.terminal-icon { color: #111b21; font-size: 22px; font-weight: bold; font-family: monospace; }
.terminal-overlay { position: fixed; inset: 0; background: #000000; z-index: 999; display: flex; flex-direction: column; font-family: monospace; }
.terminal-header { display: flex; justify-content: space-between; padding: 12px 16px; background: #202c33; color: #00a884; font-weight: bold; }
.terminal-header button { background: none; border: none; color: #ef4444; font-size: 20px; cursor: pointer; }
.terminal-body { flex: 1; padding: 16px; overflow-y: auto; }
.term-line { color: #d1d5db; font-size: 13px; margin-bottom: 4px; white-space: pre-wrap; }
.term-line .pre { color: #00a884; margin-right: 8px; }
.lvl-err { color: #ef4444; }
.lvl-ok { color: #3b82f6; }
.lvl-warn { color: #eab308; }
.terminal-input { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: #111b21; border-top: 1px solid #202c33; }
.prompt { color: #00a884; font-weight: bold; white-space: nowrap; }
.terminal-input input { flex: 1; background: transparent; border: none; outline: none; color: white; font-family: monospace; font-size: 14px; }
.bottom-nav { display: flex; justify-content: space-around; align-items: center; background: #202c33; padding: 8px 0 16px; border-top: 1px solid #2a3942; position: fixed; bottom: 0; width: 100%; z-index: 50; }
.nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #8696a0; cursor: pointer; }
.nav-item.active { color: #00a884; }
.nav-icon { font-size: 20px; }
.nav-label { font-size: 11px; font-weight: 600; }
.active-view { padding: 16px; height: 100%; overflow-y: auto; }
.back-btn { background: transparent; border: 1px solid #00a884; color: #00a884; padding: 8px 16px; border-radius: 8px; margin-bottom: 16px; cursor: pointer; font-weight: bold; }
</style>