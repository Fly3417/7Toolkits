<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
const emit = defineEmits<{ (e: "done"): void }>();

const props = defineProps<{
  modules: { name: string; cat: string }[]
}>();

const progress = ref(0);
const currentLine = ref(0);
const canEnter = ref(false);

const bootLines = computed(() => {
  const lines = [
    "[✓] loading kernel modules...",
    "[✓] mounting /data/7byte...",
    "[✓] init: async runtime (tokio rt-multi-thread)",
    "[✓] init: rustls tls stack + webpki roots",
  ];

  const cats = Array.from(new Set(props.modules.map(m => m.cat)));
  
  cats.forEach(cat => {
    const mods = props.modules.filter(m => m.cat === cat).map(m => m.name).join(" // ");
    if (mods) lines.push(`[✓] ${cat}: ${mods}`);
  });

  lines.push("[✓] compiling regex matchers...");
  lines.push(`[✓] arsenal armed. ${props.modules.length} modules online.`);
  
  return lines;
});

onMounted(() => {
  const interval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.floor(Math.random() * 5) + 2;
      if (progress.value > 100) progress.value = 100;
      
      const targetLine = Math.floor((progress.value / 100) * bootLines.value.length);
      if (targetLine > currentLine.value) {
        currentLine.value = Math.min(targetLine, bootLines.value.length);
      }
    } else {
      clearInterval(interval);
      canEnter.value = true;
    }
  }, 80);
});

function enterApp() {
  if (canEnter.value) emit("done");
}
</script>

<template>
  <div class="splash" @click="enterApp">
    <div class="border-box">
      <div class="header">[ SYSTEM BOOT ]</div>

      <div class="logo-area">
        <pre class="ascii-logo">
 ███████╗██████╗ ██╗   ██╗████████╗███████╗
 ██╔════╝██╔══██╗╚██╗ ██╔╝╚══██╔══╝██╔════╝
 ███████╗██████╔╝ ╚████╔╝    ██║   █████╗  
 ╚════██║██╔══██╗  ╚██╔╝     ██║   ██╔══╝  
 ███████║██████╔╝   ██║      ██║   ███████╗
 ╚══════╝╚═════╝    ╚═╝      ╚═╝   ╚══════╝
        </pre>
        <div class="title">[ 7TOOLKITS ]</div>
        <div class="subtitle">OFFENSIVE TOOLKIT · V1.0.0</div>
      </div>

      <div class="terminal-box">
        <div class="term-cmd">root@7byte:~$ ./init --arm <span class="cursor">▊</span></div>
        <div class="term-lines">
          <div v-for="(line, i) in bootLines.slice(0, currentLine)" :key="i" class="term-line">
            {{ line }}
          </div>
        </div>
      </div>

      <div class="progress-area">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-text">{{ progress }}%</div>
      </div>

      <div class="footer">
        <div class="credits">CREATED BY <span class="credit-name">SEVENBYTE</span></div>
        <div class="status" :class="{ ready: canEnter }">
          {{ canEnter ? '[ TAP TO ENTER ]' : '[ INITIALIZING ]' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.splash { position: fixed; inset: 0; background: #0d1117; display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 16px; cursor: pointer; }
.border-box { width: 100%; max-width: 600px; border: 1px solid #30363d; position: relative; padding: 30px 20px; background: rgba(22, 27, 34, 0.8); box-shadow: 0 0 20px rgba(0, 0, 0, 0.5); }
.border-box::before, .border-box::after { content: ''; position: absolute; width: 20px; height: 20px; border: 2px solid var(--alert); }
.border-box::before { top: -1px; left: -1px; border-right: none; border-bottom: none; }
.border-box::after { bottom: -1px; right: -1px; border-left: none; border-top: none; }
.header { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #0d1117; padding: 0 10px; color: var(--alert); font-size: 12px; letter-spacing: 0.2em; border: 1px solid #30363d; border-top: none; }
.logo-area { text-align: center; margin-bottom: 24px; }
.ascii-logo { color: var(--info); font-size: 8px; line-height: 1.1; font-weight: 700; text-shadow: 0 0 10px rgba(121, 192, 255, 0.4); margin: 0; white-space: pre; }
.title { color: var(--fg); font-size: 18px; font-weight: 700; letter-spacing: 0.3em; margin-top: 10px; }
.subtitle { color: var(--fg-dim); font-size: 10px; letter-spacing: 0.2em; margin-top: 4px; }
.terminal-box { border: 1px solid #30363d; background: #09090b; padding: 12px; font-size: 12px; min-height: 220px; }
.term-cmd { color: var(--alert); margin-bottom: 8px; }
.cursor { animation: blink 1s steps(2) infinite; }
@keyframes blink { 50% { opacity: 0; } }
.term-lines { display: flex; flex-direction: column; gap: 3px; }
.term-line { color: var(--valid); font-size: 10px; }
.progress-area { display: flex; align-items: center; gap: 12px; margin-top: 16px; }
.progress-bar { flex: 1; height: 4px; background: #30363d; overflow: hidden; }
.progress-fill { height: 100%; background: var(--alert); transition: width 0.1s linear; }
.progress-text { color: var(--alert); font-size: 12px; font-weight: 700; min-width: 40px; text-align: right; }
.footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 10px; letter-spacing: 0.1em; }
.credits { color: var(--fg-dim); }
.credit-name { color: var(--fg); font-weight: 700; }
.status { color: var(--alert); animation: pulse 1s infinite alternate; }
.status.ready { color: var(--accent); animation: none; text-shadow: 0 0 8px var(--accent); }
@keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }
</style>