export interface Node {
    id: number;
    links: Link[];
}

export interface Link {
    id: number;
    source: Node;
    target: Node;
}

export interface GraphData {
    nodes: Node[];
    links: Link[];
}

export class GraphManager {
    private nextNodeId: number = 0;
    private nextLinkId: number = 0;
    private nodes: Map<number, Node> = new Map();
    private links: Map<number, Link> = new Map();
    private removalProbabilities: Map<number, number> = new Map();
    private maxLinks: number;

    constructor({ initialLinks, maxLinks }: { initialLinks: number, maxLinks: number }) {
        this.maxLinks = maxLinks;
        this.addLinks({ linkCount: initialLinks, addNodeProbability: 1 });
    }

    setMaxLinks(val: number) {
        this.maxLinks = val;
    }

    addLinks({ linkCount = 1, addNodeProbability = 1 }: { linkCount?: number, addNodeProbability?: number } = {}) {
        for (let i = 0; i < linkCount; i++) {
            this.addLink(addNodeProbability);
        }
    }

    addLink(addNodeProbability: number = 0.5) {
        // Select potential targets: either existing or placeholder for new
        let t1: Node | null = this.getRandomNode();
        let t2: Node | null = this.shouldDo(addNodeProbability) ? null : this.getRandomNode();

        // Check maxLinks constraint for existing targets
        if ((t1 && t1.links.length >= this.maxLinks) || (t2 && t2.links.length >= this.maxLinks)) {
            return;
        }

        // Now safe to instantiate or finalize targets
        const target1 = t1 || this.newNode();
        const target2 = t2 || this.newNode();

        const newLink: Link = {
            id: this.nextLinkId++,
            source: target1,
            target: target2
        };

        this.links.set(newLink.id, newLink);

        // Update nodes with the new link
        target1.links.push(newLink);
        target2.links.push(newLink);
    }

    newNode(): Node {
        const newNode: Node = {
            id: this.nextNodeId++,
            links: []
        };
        this.nodes.set(newNode.id, newNode);
        return newNode;
    }

    removeNode(nodeId: number) {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        // Iterate over a copy of links attached to this node
        const linksToRemove = [...node.links];
        for (const link of linksToRemove) {
            this.removeLink(link.id);
        }

        // Finally remove the node
        this.nodes.delete(nodeId);
    }

    removeLinks() {
        for (const link of this.links.values()) {
            if (this.shouldDo(this.removeLinkProbability(link))) {
                this.removeLink(link.id);
            }
        }
    }

    removeLinkProbability(link: Link): number {
        const sourceWeight = link.source.links.length;
        const targetWeight = link.target.links.length;
        const nodeWeight: number = sourceWeight + targetWeight;
        console.log(`Node weight: ${nodeWeight}`)

        // Map nodeWeight [2, maxLinks * 2] to slider keys [1, 5]
        const maxWeight = this.maxLinks * 2;
        if (maxWeight <= 2) return 0; // Avoid division by zero

        const normalizedDensity = 1 + (nodeWeight - 2) * (4 / (maxWeight - 2));
        const clampedDensity = Math.max(1, Math.min(normalizedDensity, 5));

        const lowerKey = Math.floor(clampedDensity);
        const upperKey = Math.ceil(clampedDensity);
        const fraction = clampedDensity - lowerKey;

        const lowerVal = this.removalProbabilities.get(lowerKey) || 0;
        const upperVal = this.removalProbabilities.get(upperKey) || 0;
        console.log(`Lower key: ${lowerKey}, Upper key: ${upperKey}, Fraction: ${fraction}`);
        console.log(`Lower value: ${lowerVal}, Upper value: ${upperVal}`);

        // Linear interpolation of slider values
        const interpolatedSliderValue = lowerVal + fraction * (upperVal - lowerVal);

        if (interpolatedSliderValue <= 0) return 0;

        // Apply logarithmic transformation to the interpolated slider value
        const probability = Math.pow(10, (5 * (interpolatedSliderValue - 100)) / 100);
        console.log(`Interpolated Slider Value: ${interpolatedSliderValue}, Probability: ${probability}`);
        return probability;
    }

    setRemovalProbabilities(map: Map<number, number>) {
        this.removalProbabilities = map;
    }

    removeLink(linkId: number) {
        const link = this.links.get(linkId);
        if (!link) return;

        const sourceNode = link.source;
        const targetNode = link.target;

        // Remove the link reference from both nodes
        sourceNode.links = sourceNode.links.filter(l => l.id !== linkId);
        if (sourceNode.links.length === 0) {
            this.nodes.delete(sourceNode.id);
        }

        targetNode.links = targetNode.links.filter(l => l.id !== linkId);
        if (targetNode.links.length === 0) {
            this.nodes.delete(targetNode.id);
        }

        // Remove the link itself
        this.links.delete(linkId);
    }

    getGraphData(): GraphData {
        return {
            nodes: Array.from(this.nodes.values()),
            links: Array.from(this.links.values())
        };
    }

    private getRandomNode(): Node | null {
        const candidates = Array.from(this.nodes.values());
        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    private shouldDo(probability: number): boolean {
        return Math.random() < probability;
    }

    resetIfEmpty() {
        if (this.nodes.size === 0) {
            this.addLinks();
        }
    }

    clearGraph() {
        this.nodes.clear();
        this.links.clear();
    }
}
