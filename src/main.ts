import './style.css';
// @ts-ignore
import ForceGraph3D from '3d-force-graph';
import { GraphManager } from './graphManager';

const elem = document.getElementById("three-d-graph")!;
const nodeCountEl = document.getElementById("node-count")!;
const linkCountEl = document.getElementById("link-count")!;
const toggleBtn = document.getElementById("toggle-dynamic") as HTMLButtonElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;
const stepBtn = document.getElementById("step-btn") as HTMLButtonElement;
const clearBtn = document.getElementById("clear-btn") as HTMLButtonElement;
const speedSlider = document.getElementById("speed-slider") as HTMLInputElement;
const edgesPerTickInput = document.getElementById("links-per-tick") as HTMLInputElement;
const minimizeBtn = document.getElementById("minimize-btn") as HTMLButtonElement;
const controlsPanel = document.getElementById("controls-panel")!;
const pauseIcon = document.getElementById("pause-icon")!;
const playIcon = document.getElementById("play-icon")!;

let isPaused = false;
let tickSpeed = parseInt(speedSlider.value);
let linksPerTick = parseInt(edgesPerTickInput.value);
let growthTimeout: number | null = null;
const manager = new GraphManager(1);

// Initialize Graph
const Graph = new ForceGraph3D(elem)
    .backgroundColor('#050505')
    .nodeColor(() => '#00d2ff')
    .nodeRelSize(6)
    .linkColor(() => '#efefd9ff')
    .linkWidth(2)
    .linkDirectionalParticles(2)
    .linkDirectionalParticleSpeed(0.005)
    .enableNodeDrag(true)
    .onNodeClick(removeNode)
    .graphData(manager.getGraphData());

// Update stats initially
updateStats();

// Growth Logic
function tick() {
    if (!isPaused) {
        performStep();
    }
    scheduleNextTick();
}

function performStep() {
    manager.resetIfEmpty();
    manager.addLinks({ linkCount: linksPerTick, addNodeProbability: 0.5 });
    Graph.graphData(manager.getGraphData());
    updateStats();
}

function scheduleNextTick() {
    if (growthTimeout) clearTimeout(growthTimeout);
    growthTimeout = window.setTimeout(tick, tickSpeed);
}

// Start Growth
scheduleNextTick();

// Functions
function removeNode(node: any) {
    manager.removeNode(node.id);
    Graph.graphData(manager.getGraphData());
    updateStats();
}

function updateStats() {
    const { nodes, links } = manager.getGraphData();
    nodeCountEl.innerText = nodes.length.toString();
    linkCountEl.innerText = links.length.toString();
}

// UI Event Listeners
toggleBtn.addEventListener('click', () => {
    isPaused = !isPaused;

    // Toggle icons
    pauseIcon.style.display = isPaused ? 'none' : 'block';
    playIcon.style.display = isPaused ? 'block' : 'none';

    // Update button state and tooltip
    toggleBtn.title = isPaused ? 'Resume Growth' : 'Pause Growth';
    toggleBtn.classList.toggle('btn-secondary', isPaused);
    toggleBtn.classList.toggle('btn-primary', !isPaused);
});

resetBtn.addEventListener('click', () => {
    Graph.cameraPosition({ x: 0, y: 0, z: 1000 }, { x: 0, y: 0, z: 0 }, 1000);
});

stepBtn.addEventListener('click', () => {
    if (isPaused) {
        performStep();
    }
});

clearBtn.addEventListener('click', () => {
    manager.clearGraph();
    Graph.graphData(manager.getGraphData());
    updateStats();
});

speedSlider.addEventListener('input', () => {
    // Invert speed: 2000 (Slow) at left, 10 (Fast) at right
    // However the browser default is left to right (low to high). 
    // User said: 'Slow' = 2000ms to 'Fast' = 10ms.
    // So if slider is at 10 (left), it should be 2000ms. If at 2000 (right), it should be 10ms.
    const sliderVal = parseInt(speedSlider.value);
    tickSpeed = 2010 - sliderVal;
});

minimizeBtn.addEventListener('click', () => {
    controlsPanel.classList.toggle('minimized');
});
