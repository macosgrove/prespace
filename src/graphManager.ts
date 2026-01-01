export interface Node {
    id: number;
    linkIds: number[];
}

export interface Link {
    id: number;
    source: any; // Can be ID or object
    target: any;
}

export interface GraphData {
    nodes: Node[];
    links: Link[];
}

export class GraphManager {
    private nextNodeId: number = 0;
    private nextLinkId: number = 0;
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

        const newLink: Link = {
            id: this.nextLinkId++,
            source: target1.id,
            target: target2.id
        };

        this.data.links.push(newLink);

        // Update nodes with the new link ID
        target1.linkIds.push(newLink.id);
        target2.linkIds.push(newLink.id);

        return target2;
    }

    newNode(): Node {
        const newNode: Node = {
            id: this.nextNodeId++,
            linkIds: []
        };
        this.data.nodes.push(newNode);
        return newNode;
    }

    removeNode(nodeId: number) {
        // Identify links to be removed
        const linksToRemove = this.data.links.filter(l => {
            const sId = typeof l.source === 'object' ? l.source.id : l.source;
            const tId = typeof l.target === 'object' ? l.target.id : l.target;
            return sId === nodeId || tId === nodeId;
        });
        const linkIdsToRemove = new Set(linksToRemove.map(l => l.id));

        // Filter nodes
        this.data.nodes = this.data.nodes.filter(n => n.id !== nodeId);

        // Remove link IDs from remaining nodes
        this.data.nodes.forEach(n => {
            if (n.linkIds.length > 0) {
                n.linkIds = n.linkIds.filter(id => !linkIdsToRemove.has(id));
            }
        });

        // Filter links
        this.data.links = this.data.links.filter(l => !linkIdsToRemove.has(l.id));
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
