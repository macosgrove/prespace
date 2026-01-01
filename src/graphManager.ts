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
    private nodes: Map<number, Node> = new Map();
    private links: Map<number, Link> = new Map();

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

        this.links.set(newLink.id, newLink);

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
        this.nodes.set(newNode.id, newNode);
        return newNode;
    }

    removeNode(nodeId: number) {
        const node = this.nodes.get(nodeId);
        if (!node) return;

        // Iterate over the linkIds attached to this node
        for (const linkId of node.linkIds) {
            const link = this.links.get(linkId);
            if (!link) continue;

            // Find the other node connected by this link
            const sId = typeof link.source === 'object' ? link.source.id : link.source;
            const tId = typeof link.target === 'object' ? link.target.id : link.target;
            const otherNodeId = sId === nodeId ? tId : sId;

            const otherNode = this.nodes.get(otherNodeId);
            if (otherNode) {
                // Remove the link reference from the other node
                otherNode.linkIds = otherNode.linkIds.filter(id => id !== linkId);
            }

            // Remove the link itself
            this.links.delete(linkId);
        }

        // Finally remove the node
        this.nodes.delete(nodeId);
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
