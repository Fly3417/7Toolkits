<script setup lang="ts">
import { ref } from "vue";
import SysInfo from "./components/modules/SysInfo.vue";

const active = ref<string | null>(null);

const tools = [
  { id: "sysinfo", code: "01", name: "sys-info", tagline: "device recon", desc: "Get local OS, arch, and hostname info." }
];
</script>

<template>
  <div class="shell">
    <header class="hdr">
      <div class="hdr-top">
        <button v-if="active" class="hdr-back" @click="active = null" title="back to arsenal">◀ back</button>
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
        <span class="hdr-status">
          <span class="pulse" />
          {{ active ? "armed" : "idle" }}
        </span>
      </div>
      <div class="hdr-sub">
        <span class="crumb-user">root@sevenbyte</span>
        <span class="crumb-sep">:</span>
        <span class="crumb-path">~/arsenal</span>
        <span class="crumb-sep">$</span>
        <span v-if="!active" class="crumb-cmd"> ls -la</span>
        <span class="crumb-cursor">▊</span>
      </div>
    </header>

    <main class="main">
      <div v-if="!active" class="arsenal">
        <div class="grid">
          <button
            v-for="t in tools"
            :key="t.id"
            class="tile"
            @click="active = t.id"
          >
            <div class="tile-top">
              <span class="tile-code">[{{ t.code }}]</span>
            </div>
            <div class="tile-name">{{ t.name }}</div>
            <div class="tile-tag">{{ t.tagline }}</div>
            <div class="tile-desc">{{ t.desc }}</div>
            <div class="tile-foot">
              <span class="sev">info</span>
              <span class="tile-arrow">▶</span>
            </div>
          </button>
        </div>
      </div>

      <div v-else class="tool">
        <SysInfo v-if="active === 'sysinfo'" />
      </div>
    </main>

    <footer class="foot">
      <span class="foot-l">7Toolkits v1.0.0 // offensive toolkit</span>
      <span class="foot-r">[Credits: Tegal 1337]</span>
    </footer>
  </div>
</template>

<style scoped>
.shell {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hdr {
  flex-shrink: 0;
  border-bottom: 1px solid var(--border);
  background: var(--bg-elev);
}
.hdr-top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 12px 4px;
}
.hdr-back {
  color: var(--alert);
  border: 1px solid var(--alert);
  padding: 3px 8px;
  font-size: 11px;
  margin-top: 4px;
}
.hdr-back:hover { background: var(--alert); color: var(--bg); }
.banner-wrap {
  flex: 1;
  overflow-x: auto;
}
.banner-art {
  color: var(--accent);
  font-size: 9px;
  line-height: 1.1;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.25);
  margin: 0;
  white-space: pre;
}
.hdr-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
}
.tag {
  font-size: 10px;
  color: var(--fg-dim);
  padding: 1px 6px;
  border: 1px solid var(--border);
}
.hdr-spacer { flex: 1; }
.hdr-status {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: var(--accent);
  text-transform: uppercase;
}
.pulse {
  width: 6px; height: 6px;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: pulse 1.5s infinite;
}
@keyframes pulse { 50% { opacity: 0.3; } }
.hdr-sub {
  padding: 4px 12px 6px;
  font-size: 11px;
}
.crumb-user { color: var(--accent); }
.crumb-sep { color: var(--fg-ghost); }
.crumb-path { color: var(--info); }
.crumb-cursor { color: var(--accent); animation: blink 1s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0; } }

.main { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
.arsenal { flex: 1; overflow-y: auto; padding: 12px; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}
.tile {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  padding: 10px 12px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  min-height: 130px;
  position: relative;
}
.tile::before {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 2px; height: 100%;
  background: var(--accent);
  opacity: 0.5;
}
.tile:hover { border-color: var(--accent); background: var(--bg-elev); }
.tile:hover::before { opacity: 1; box-shadow: 0 0 10px var(--accent); }
.tile-top { display: flex; justify-content: space-between; }
.tile-code { color: var(--fg-ghost); font-size: 10px; }
.tile-name { font-size: 15px; font-weight: 700; color: var(--fg); }
.tile-tag { font-size: 10px; color: var(--fg-dim); text-transform: uppercase; }
.tile-desc { font-size: 11px; color: var(--fg-dim); flex: 1; }
.tile-foot { display: flex; justify-content: space-between; align-items: center; }
.sev { font-size: 9px; padding: 1px 4px; border: 1px solid var(--fg-ghost); color: var(--fg-ghost); }
.tile-arrow { color: var(--fg-ghost); font-size: 10px; }

.tool { flex: 1; padding: 10px 12px; display: flex; overflow: hidden; }

.foot {
  flex-shrink: 0;
  padding: 5px 12px;
  border-top: 1px solid var(--border);
  background: var(--bg-elev);
  font-size: 10px;
  color: var(--fg-dim);
  display: flex;
  justify-content: space-between;
}
</style>