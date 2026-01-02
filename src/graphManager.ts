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

    constructor(initialLinks: number = 1) {
        this.addLinks({ linkCount: initialLinks, addNodeProbability: 1, maxLinks: initialLinks });
    }

    addLinks({ linkCount = 1, addNodeProbability = 1, maxLinks }: { linkCount?: number, addNodeProbability?: number, maxLinks: number }) {
        for (let i = 0; i < linkCount; i++) {
            this.addLink(addNodeProbability, maxLinks);
        }
    }

    addLink(addNodeProbability: number = 0.5, maxLinks: number) {
        const target1 = this.getRandomNode() || this.newNode();
        const target2 = this.shouldDo(addNodeProbability) ? this.newNode() : this.getRandomNode() || this.newNode();

        // Check maxLinks constraint
        if (target1.links.length >= maxLinks || target2.links.length >= maxLinks) {
            return;
        }

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

        // Clamp weight between 2 and 6 for probability lookup
        const lookupKey = Math.max(2, Math.min(nodeWeight, 6));
        return this.removalProbabilities.get(lookupKey) || 0;
    }

    updateRemovalProbabilities(map: Map<number, number>) {
        // Map keys are 2, 3, 4, 5, 6 corresponding to density levels
        for (const [key, value] of map.entries()) {
            let probability = 0;
            if (value > 0) {
                // Logarithmic scale: value 10 -> 1, value 1 -> 1e-5
                // Formula: 10^((5/9) * (value - 10))
                probability = Math.pow(10, (5 * (value - 10)) / 9);
            }
            this.removalProbabilities.set(key, probability);
        }
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

    resetIfEmpty(maxLinks: number = 100) {
        if (this.nodes.size === 0) {
            this.addLinks({ maxLinks });
        }
    }

    clearGraph() {
        this.nodes.clear();
        this.links.clear();
    }
}
