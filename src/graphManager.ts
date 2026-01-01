export interface Node {
    id: number;
}

export interface Link {
    source: any; // Can be ID or object
    target: any;
}

export interface GraphData {
    nodes: Node[];
    links: Link[];
}

export class GraphManager {
    private nextNodeId: number = 0;
    private data: GraphData = { nodes: [], links: [] };

    constructor(initialLinks: number = 1) {
        this.addLinks({ linkCount: initialLinks, addNodeProbability: 1 });
    }

    addLinks({ linkCount = 1, addNodeProbability = 1 }: { linkCount?: number, addNodeProbability?: number } = {}): Node | undefined {
        let lastNode: Node | undefined;
        for (let i = 0; i < linkCount; i++) {
            lastNode = this.addLink(addNodeProbability);
        }
        return lastNode;
    }

    addLink(addNodeProbability: number = 0.5): Node {
        const target1 = this.getRandomNode() || this.newNode();
        const target2 = this.shouldDo(addNodeProbability) ? this.newNode() : this.getRandomNode() || this.newNode();
        this.data.links.push({ source: target1.id, target: target2.id });
        return target2;
    }

    newNode(): Node {
        const newNode: Node = { id: this.nextNodeId++ };
        this.data.nodes.push(newNode);
        return newNode;
    }

    removeNode(nodeId: number) {
        // Filter nodes
        this.data.nodes = this.data.nodes.filter(n => n.id !== nodeId);

        // Filter links (handling potential object-based source/target from 3d-force-graph)
        this.data.links = this.data.links.filter(l => {
            const sId = typeof l.source === 'object' ? l.source.id : l.source;
            const tId = typeof l.target === 'object' ? l.target.id : l.target;
            return sId !== nodeId && tId !== nodeId;
        });
    }

    getGraphData(): GraphData {
        return {
            nodes: [...this.data.nodes],
            links: [...this.data.links]
        };
    }

    private getRandomNode(): Node | null {
        const candidates = this.data.nodes;
        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    private shouldDo(probability: number): boolean {
        return Math.random() < probability;
    }

    resetIfEmpty() {
        if (this.data.nodes.length === 0) {
            this.addLinks();
        }
    }

    clearGraph() {
        this.data.nodes = [];
        this.data.links = [];
    }
}
