const atomSelect = document.getElementById("myRange");
const decaySelect = document.getElementById("decaySides");
const output = document.getElementById("demo");
const remainingCount = document.getElementById("remainingCount");
const roundCount = document.getElementById("roundCount");
const halfLifeDisplay = document.getElementById("halfLifeDisplay");
const grid = document.getElementById("grid");
const counter = document.getElementById("counter");
const timeRow = document.getElementById("wurf");
const decayRow = document.getElementById("messwert");
const remainingRow = document.getElementById("restwert");
const chartContainer = document.getElementById("DownloadContainer");

const state = {
  atoms: Number(atomSelect.value),
  decayMode: Number(decaySelect.value),
  maxRenderedAtoms: 2500,
  decayed: [],
  round: 0,
  remaining: 0,
  history: [],
  timer: null,
  chartVisible: true,
  halfLifeRound: null,
};

function decayProbability() {
  if (state.decayMode === 4) return 0.5;
  if (state.decayMode === 10) return 0.1;
  return 1 / 6;
}

function renderedAtomCount() {
  return Math.min(state.atoms, state.maxRenderedAtoms);
}

function formatNumber(value) {
  return new Intl.NumberFormat("de-DE").format(value);
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function resetTable() {
  timeRow.innerHTML = "<th>Zeit</th>";
  decayRow.innerHTML = "<th>zerfallene Kerne ΔN</th>";
  remainingRow.innerHTML = "<th>verbleibende Kerne N</th>";
}

function updateStats() {
  output.textContent = formatNumber(state.atoms);
  remainingCount.textContent = formatNumber(state.remaining);
  roundCount.textContent = state.round;
  counter.textContent = `Verbleibende Cubetonium-Atome: ${formatNumber(state.remaining)}`;
  halfLifeDisplay.textContent = state.halfLifeRound ? `${state.halfLifeRound} s` : "–";
}

function initGrid() {
  const count = renderedAtomCount();
  const cols = Math.ceil(Math.sqrt(count));
  const gap = count > 1000 ? 1 : 3;
  const gridWidth = grid.clientWidth || 1000;
  const gridHeight = grid.clientHeight || 360;
  const size = Math.max(4, Math.min(28, (Math.min(gridWidth, gridHeight) - cols * gap) / cols));

  grid.innerHTML = "";
  for (let index = 0; index < count; index += 1) {
    const atom = document.createElement("div");
    const row = Math.floor(index / cols);
    const column = index % cols;
    atom.className = "dice";
    atom.id = `die${index}`;
    atom.textContent = state.decayMode === 10 ? "•" : "1";
    atom.style.width = `${size}px`;
    atom.style.height = `${size}px`;
    atom.style.fontSize = `${Math.max(6, size * 0.48)}px`;
    atom.style.left = `${12 + column * (size + gap)}px`;
    atom.style.top = `${12 + row * (size + gap)}px`;
    grid.appendChild(atom);
  }
}

function resetSimulation() {
  stopAutoRun();
  state.atoms = Number(atomSelect.value);
  state.decayMode = Number(decaySelect.value);
  state.decayed = Array.from({ length: state.atoms }, () => false);
  state.round = 0;
  state.remaining = state.atoms;
  state.history = [{ time: 0, remaining: state.atoms, decays: 0 }];
  state.halfLifeRound = null;
  resetTable();
  initGrid();
  updateStats();
  plotChart();
}

function shouldDecay() {
  if (state.decayMode === 4) return Math.random() >= 0.5;
  return Math.floor(Math.random() * state.decayMode) + 1 === state.decayMode;
}

function rollDie(index) {
  if (state.decayed[index] || !shouldDecay()) {
    const atom = document.getElementById(`die${index}`);
    if (atom) atom.textContent = String(Math.floor(Math.random() * Math.min(state.decayMode, 6)) + 1);
    return false;
  }

  state.decayed[index] = true;
  const atom = document.getElementById(`die${index}`);
  if (atom) {
    atom.classList.add("decayed");
    window.setTimeout(() => atom.remove(), 170);
  }
  return true;
}

function rollAllDice() {
  if (state.remaining === 0) return;

  let decays = 0;
  for (let index = 0; index < state.atoms; index += 1) {
    if (rollDie(index)) decays += 1;
  }

  state.round += 1;
  state.remaining -= decays;

  if (!state.halfLifeRound && state.remaining <= state.atoms / 2) {
    state.halfLifeRound = state.round;
  }

  state.history.push({ time: state.round, remaining: state.remaining, decays });
  timeRow.appendChild(createCell(`${state.round} s`));
  decayRow.appendChild(createCell(formatNumber(decays)));
  remainingRow.appendChild(createCell(formatNumber(state.remaining)));
  updateStats();
  plotChart();

  if (state.remaining === 0) stopAutoRun();
}

function stopAutoRun() {
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
  document.getElementById("autoRun").textContent = "Auto-Lauf";
}

function toggleAutoRun() {
  if (state.timer) {
    stopAutoRun();
    return;
  }
  rollAllDice();
  state.timer = window.setInterval(rollAllDice, 650);
  document.getElementById("autoRun").textContent = "Pause";
}

function plotChart() {
  if (!window.d3) return;

  const svg = d3.select("#v4");
  svg.selectAll("*").remove();

  const bounds = chartContainer.getBoundingClientRect();
  const width = Math.max(680, bounds.width || 900);
  const height = 360;
  const margin = { top: 24, right: 28, bottom: 48, left: 72 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  svg.attr("viewBox", `0 0 ${width} ${height}`);
  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const maxTime = Math.max(8, d3.max(state.history, (d) => d.time) || 1);
  const maxDecay = Math.max(1, d3.max(state.history, (d) => d.decays) || 1);
  const yMax = Math.max(state.atoms, maxDecay);

  const x = d3.scaleLinear().domain([0, maxTime]).range([0, innerWidth]);
  const yRemaining = d3.scaleLinear().domain([0, state.atoms]).nice().range([innerHeight, 0]);
  const yDecay = d3.scaleLinear().domain([0, yMax]).nice().range([innerHeight, 0]);

  g.append("g").attr("class", "grid-line").call(d3.axisLeft(yRemaining).tickSize(-innerWidth).tickFormat(""));
  g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerHeight})`).call(d3.axisBottom(x).ticks(Math.min(maxTime, 12)).tickFormat((d) => `${d}s`));
  g.append("g").attr("class", "axis").call(d3.axisLeft(yRemaining).ticks(6));

  g.append("text").attr("x", 0).attr("y", -8).attr("fill", "#2563eb").attr("font-weight", 800).text("N(t)");
  g.append("text").attr("x", innerWidth).attr("y", -8).attr("text-anchor", "end").attr("fill", "#ef4444").attr("font-weight", 800).text("ΔN");

  const remainingLine = d3.line().x((d) => x(d.time)).y((d) => yRemaining(d.remaining)).curve(d3.curveMonotoneX);
  const decayLine = d3.line().x((d) => x(d.time)).y((d) => yDecay(d.decays)).curve(d3.curveMonotoneX);

  g.append("path").datum(state.history).attr("class", "line-remaining").attr("d", remainingLine);
  g.append("path").datum(state.history.slice(1)).attr("class", "line-decay").attr("d", decayLine);

  g.selectAll(".dot-remaining")
    .data(state.history)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 4)
    .attr("cx", (d) => x(d.time))
    .attr("cy", (d) => yRemaining(d.remaining))
    .attr("stroke", "#2563eb");

  g.selectAll(".dot-decay")
    .data(state.history.slice(1))
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 4)
    .attr("cx", (d) => x(d.time))
    .attr("cy", (d) => yDecay(d.decays))
    .attr("stroke", "#ef4444");
}

function toggleChart() {
  state.chartVisible = !state.chartVisible;
  chartContainer.hidden = !state.chartVisible;
}

document.getElementById("Start").addEventListener("click", rollAllDice);
document.getElementById("Restart").addEventListener("click", resetSimulation);
document.getElementById("autoRun").addEventListener("click", toggleAutoRun);
document.getElementById("toggleChart").addEventListener("click", toggleChart);
atomSelect.addEventListener("change", resetSimulation);
decaySelect.addEventListener("change", resetSimulation);
document.addEventListener("keydown", (event) => {
  if (event.code === "KeyW") rollAllDice();
});
window.addEventListener("resize", () => {
  initGrid();
  plotChart();
});

resetSimulation();
