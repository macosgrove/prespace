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

    constructor(initialNodes: number = 1) {
        for (let i = 0; i < initialNodes; i++) {
            this.addNode();
        }
    }

    addNode(targetId?: number): Node {
        const newNode: Node = { id: this.nextNodeId++ };
        this.data.nodes.push(newNode);

        if (targetId !== undefined || this.data.nodes.length > 1) {
            const actualTarget = targetId !== undefined ? targetId : this.getRandomNodeId(newNode.id);
            if (actualTarget !== null) {
                this.data.links.push({ source: newNode.id, target: actualTarget });
            }
        }
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

    private getRandomNodeId(excludeId: number): number | null {
        const candidates = this.data.nodes.filter(n => n.id !== excludeId);
        if (candidates.length === 0) return null;
        return candidates[Math.floor(Math.random() * candidates.length)].id;
    }

    resetIfEmpty() {
        if (this.data.nodes.length === 0) {
            this.addNode();
        }
    }
}
