import { describe, it, expect, vi } from 'vitest';
import { GraphManager } from './graphManager';

describe('GraphManager', () => {
    it('should initialize with the requested number of links', () => {
        const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
        const data = manager.getGraphData();
        expect(data.nodes.length).toBe(2);
        expect(data.links.length).toBe(1);
    });

    it('should add a link and connecting an existing node to a new node', () => {
        const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });

        manager.addLinks({ linkCount: 1, addNodeProbability: 1 });
        const data = manager.getGraphData();

        expect(data.nodes.length).toBe(3);
        expect(data.links.length).toBe(2);
        const newNode = data.nodes[2];
        const newLink = data.links[1];
        expect(newLink.target.id).toBe(newNode.id);
    });

    it('should add a link connecting two existing nodes', () => {
        const manager = new GraphManager({ initialLinks: 100, maxLinks: 100 });
        const data = manager.getGraphData();
        expect(data.nodes.length).toBe(101);
        expect(data.links.length).toBe(100);

        manager.addLinks({ linkCount: 1, addNodeProbability: 0 });
        const newData = manager.getGraphData();
        expect(newData.nodes.length).toBe(101);
        expect(newData.links.length).toBe(101);
    });

    it('should correctly remove a node and its associated links', () => {
        const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
        const initialNode = manager.getGraphData().nodes[0];

        expect(manager.getGraphData().nodes.length).toBe(2);
        expect(manager.getGraphData().links.length).toBe(1);

        manager.removeNode(initialNode.id);
        const data = manager.getGraphData();

        expect(data.nodes.length).toBe(0); // Rest of the graph was orphaned
        expect(data.links.length).toBe(0);
    });

    it('should have object-based links', () => {
        const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
        const data = manager.getGraphData();
        expect(typeof data.links[0].source).toBe('object');
        expect(typeof data.links[0].target).toBe('object');
    });

    it('should track links on nodes', () => {
        const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
        const data = manager.getGraphData();
        const link = data.links[0];

        expect(data.nodes[0].links.map(l => l.id)).toContain(link.id);
        expect(data.nodes[1].links.map(l => l.id)).toContain(link.id);

        manager.removeNode(data.nodes[0].id);
        const newData = manager.getGraphData();
        // The other node should be gone too!
        expect(newData.nodes.length).toBe(0);
    });

    it('should remove a specific link and cleanup nodes', () => {
        const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
        const data = manager.getGraphData();
        const linkId = data.links[0].id;

        manager.removeLink(linkId);
        const newData = manager.getGraphData();

        expect(newData.links.length).toBe(0);
        expect(newData.nodes.length).toBe(0);
    });

    it('should restart with a new link joining two nodes if reset is called', () => {
        const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
        manager.reset();
        const newData = manager.getGraphData();
        expect(newData.nodes.length).toBe(2);
        expect(newData.links.length).toBe(1);
    });

    it('should respect maxLinks constraint and not create orphaned nodes', () => {
        const manager = new GraphManager({ initialLinks: 1, maxLinks: 1 });
        const initialData = manager.getGraphData();
        expect(initialData.nodes.length).toBe(2);
        expect(initialData.links.length).toBe(1);

        // All nodes are currently at maxLinks (1). 
        // Attempting to add a link should return early and NOT create new nodes.
        manager.addLinks({ linkCount: 1, addNodeProbability: 1 });

        const finalData = manager.getGraphData();
        expect(finalData.nodes.length).toBe(2);
        expect(finalData.links.length).toBe(1);
    });

    describe('removeLinks', () => {
        it('should remove all links when probability is 1', () => {
            const manager = new GraphManager({ initialLinks: 10, maxLinks: 100 });
            expect(manager.getGraphData().links.length).toBe(10);

            vi.spyOn(manager, 'removeLinkProbability' as any).mockReturnValue(1);

            manager.removeLinks();
            expect(manager.getGraphData().links.length).toBe(0);
        });

        it('should remove no links when probability is 0', () => {
            const manager = new GraphManager({ initialLinks: 10, maxLinks: 100 });
            expect(manager.getGraphData().links.length).toBe(10);

            vi.spyOn(manager, 'removeLinkProbability' as any).mockReturnValue(0);

            manager.removeLinks();
            expect(manager.getGraphData().links.length).toBe(10);
        });

        it('should remove nodes that become orphaned after link removal', () => {
            const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
            const data = manager.getGraphData();
            const linkId = data.links[0].id;

            expect(data.nodes.length).toBe(2);

            manager.removeLink(linkId);

            const newData = manager.getGraphData();
            expect(newData.links.length).toBe(0);
            expect(newData.nodes.length).toBe(0);
        });
    });

    describe('setRemovalProbabilities and Interpolation', () => {
        it('should perform logarithmic interpolation of probabilities', () => {
            const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
            manager.setMaxLinks(6); // Weight range [2, 12] maps to slider keys [1, 5]

            // Map keys 1-5 to slider values 0-100
            manager.setRemovalProbabilities(new Map([
                [1, 0],   // Slider 0
                [2, 0],   // Slider 0
                [3, 50],  // Slider 50
                [4, 100], // Slider 100
                [5, 100]  // Slider 100
            ]));

            const data = manager.getGraphData();
            const link = data.links[0]; // weight 2 (density 1.0)

            // Density 1.0 maps to slider value 0 -> Prob 0
            expect(manager['removeLinkProbability'](link)).toBe(0);

            // Test weight 7 (exactly in middle of [2, 12] is density 3.0)
            // Weight 7 maps to density level 1 + (7-2)*(4/10) = 3.0
            // Slider value at key 3 is 50.
            // P(slider 50) = 10^((50-100)/20) = 10^-2.5
            const n1 = manager.newNode();
            const n2 = manager.newNode();
            const lTest = { source: n1, target: n2 } as any;
            n1.links = new Array(3).fill({});
            n2.links = new Array(4).fill({}); // Total weight 7

            const prob = manager['removeLinkProbability'](lTest);
            expect(prob).toBeCloseTo(Math.pow(10, -2.5), 6);

            // Test weight 12 -> density 5.0
            // slider value at key 5 is 100 -> Prob 1
            n1.links = new Array(6).fill({});
            n2.links = new Array(6).fill({}); // Total weight 12
            expect(manager['removeLinkProbability'](lTest)).toBeCloseTo(1, 6);
        });

        it('should handle division by zero or invalid ranges gracefully', () => {
            const manager = new GraphManager({ initialLinks: 1, maxLinks: 1 });
            const data = manager.getGraphData();
            const link = data.links[0];

            // Should return 0 or default safely
            expect(manager['removeLinkProbability'](link)).toBe(0);
        });
    });

    describe('Generation Tracking', () => {
        it('should track and update graph generations', () => {
            const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
            expect(manager.getGeneration()).toBe(0);

            manager.updateGeneration();
            expect(manager.getGeneration()).toBe(1);

            manager.updateGeneration();
            expect(manager.getGeneration()).toBe(2);
        });

        it('should reset generation to 0 when graph is reset', () => {
            const manager = new GraphManager({ initialLinks: 1, maxLinks: 10 });
            manager.updateGeneration();
            manager.updateGeneration();
            expect(manager.getGeneration()).toBe(2);

            manager.reset();
            expect(manager.getGeneration()).toBe(0);
        });
    });
});
