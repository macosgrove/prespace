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

        // Iterate over a copy of linkIds attached to this node
        const linkIdsToRemove = [...node.linkIds];
        for (const linkId of linkIdsToRemove) {
            this.removeLink(linkId);
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
        const sourceNode = this.nodes.get(this.getNodeId(link.source));
        const targetNode = this.nodes.get(this.getNodeId(link.target));

        const sourceWeight = sourceNode?.linkIds?.length || 0;
        const targetWeight = targetNode?.linkIds?.length || 0;
        const nodeWeight: number = sourceWeight + targetWeight;

        const probabilityMap: Map<number, number> = new Map([
            [2, 0.2],
            [3, 0.15],
            [4, 0.1],
            [5, 0.05],
            [6, 0.02]
        ]);
        return probabilityMap.get(Math.min(nodeWeight, 6)) || 0;
    }

    private getNodeId(sourceOrTarget: any): number {
        return typeof sourceOrTarget === 'object' ? sourceOrTarget.id : sourceOrTarget;
    }


    removeLink(linkId: number) {
        const link = this.links.get(linkId);
        if (!link) return;

        // Find the connected nodes
        const sId = this.getNodeId(link.source);
        const tId = this.getNodeId(link.target);

        // Remove the link reference from both nodes
        const sourceNode = this.nodes.get(sId);
        if (sourceNode) {
            sourceNode.linkIds = sourceNode.linkIds.filter(id => id !== linkId);
        }

        const targetNode = this.nodes.get(tId);
        if (targetNode) {
            targetNode.linkIds = targetNode.linkIds.filter(id => id !== linkId);
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
