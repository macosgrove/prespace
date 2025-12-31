import './style.css';
// @ts-ignore
import ForceGraph3D from '3d-force-graph';
import { GraphManager } from './graphManager';

const elem = document.getElementById("3d-graph")!;
const nodeCountEl = document.getElementById("node-count")!;
const linkCountEl = document.getElementById("link-count")!;
const toggleBtn = document.getElementById("toggle-dynamic") as HTMLButtonElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;

let isPaused = false;
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
    .enableNodeDrag(false)
    .onNodeClick(removeNode)
    .graphData(manager.getGraphData());

// Update stats initially
updateStats();

// Growth Interval
setInterval(() => {
    if (isPaused) return;

    manager.resetIfEmpty();
    manager.addNode();

    Graph.graphData(manager.getGraphData());
    updateStats();
}, 1000);

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
    toggleBtn.innerText = isPaused ? 'Resume Growth' : 'Pause Growth';
    toggleBtn.classList.toggle('btn-secondary');
    toggleBtn.classList.toggle('btn-primary');
});

resetBtn.addEventListener('click', () => {
    Graph.cameraPosition({ x: 0, y: 0, z: 1000 }, { x: 0, y: 0, z: 0 }, 1000);
});
