import { describe, it, expect, vi } from 'vitest';
import { GraphManager } from './graphManager';

describe('GraphManager', () => {
    it('should initialize with the requested number of links', () => {
        const manager = new GraphManager(1);
        const data = manager.getGraphData();
        expect(data.nodes.length).toBe(2);
        expect(data.links.length).toBe(1);
    });

    it('should add a link and connecting an existing node to a new node', () => {
        const manager = new GraphManager(1);
        const initialId = manager.getGraphData().nodes[0].id;

        manager.addLinks({ linkCount: 1, addNodeProbability: 1, maxLinks: 10 });
        const data = manager.getGraphData();

        expect(data.nodes.length).toBe(3);
        expect(data.links.length).toBe(2);
        const newNode = data.nodes[2];
        const newLink = data.links[1];
        expect(newLink.target.id).toBe(newNode.id);
    });

    it('should add a link connecting two existing nodes', () => {
        const manager = new GraphManager(100);
        const data = manager.getGraphData();
        expect(data.nodes.length).toBe(101);
        expect(data.links.length).toBe(100);

        manager.addLinks({ linkCount: 1, addNodeProbability: 0, maxLinks: 10 });
        const newData = manager.getGraphData();
        expect(newData.nodes.length).toBe(101);
        expect(newData.links.length).toBe(101);
    });

    it('should correctly remove a node and its associated links', () => {
        const manager = new GraphManager(1);
        const initialNode = manager.getGraphData().nodes[0];

        expect(manager.getGraphData().nodes.length).toBe(2);
        expect(manager.getGraphData().links.length).toBe(1);

        manager.removeNode(initialNode.id);
        const data = manager.getGraphData();

        expect(data.nodes.length).toBe(0); // Rest of the graph was orphaned
        expect(data.links.length).toBe(0);
    });

    it('should have object-based links', () => {
        const manager = new GraphManager(1);
        const data = manager.getGraphData();
        expect(typeof data.links[0].source).toBe('object');
        expect(typeof data.links[0].target).toBe('object');
    });

    it('should track links on nodes', () => {
        const manager = new GraphManager(1);
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
        const manager = new GraphManager(1);
        const data = manager.getGraphData();
        const linkId = data.links[0].id;

        manager.removeLink(linkId);
        const newData = manager.getGraphData();

        expect(newData.links.length).toBe(0);
        expect(newData.nodes.length).toBe(0);
    });

    it('should restart with a new link joining two nodes if resetIfEmpty is called on an empty graph', () => {
        const manager = new GraphManager(1);
        const data = manager.getGraphData()
        const initialSourceId = manager.getGraphData().nodes[0].id;
        const initialTargetId = manager.getGraphData().nodes[1].id;

        manager.removeNode(initialSourceId);
        manager.removeNode(initialTargetId);
        expect(manager.getGraphData().nodes.length).toBe(0);
        expect(manager.getGraphData().links.length).toBe(0);

        manager.resetIfEmpty(10);
        const newData = manager.getGraphData();
        expect(newData.nodes.length).toBe(2);
        expect(newData.nodes[0].id).not.toBe(initialSourceId); // Should have a new persistent ID
        expect(newData.links.length).toBe(1);
    });

    it('should respect maxLinks constraint', () => {
        const manager = new GraphManager(1);
        const data = manager.getGraphData();
        const node = data.nodes[0];

        // node currently has 1 link. Set maxLinks to 1.
        // Try to add another link to this existing node by setting addNodeProbability to 0.
        manager.addLinks({ linkCount: 1, addNodeProbability: 0, maxLinks: 1 });

        const newData = manager.getGraphData();
        // Since both existing nodes already have 1 link, and maxLinks is 1, 
        // addLink should return undefined and no new link should be added.
        expect(newData.links.length).toBe(1);
    });

    describe('removeLinks', () => {
        it('should remove all links when probability is 1', () => {
            const manager = new GraphManager(10);
            expect(manager.getGraphData().links.length).toBe(10);

            vi.spyOn(manager, 'removeLinkProbability' as any).mockReturnValue(1);

            manager.removeLinks();
            expect(manager.getGraphData().links.length).toBe(0);
        });

        it('should remove no links when probability is 0', () => {
            const manager = new GraphManager(10);
            expect(manager.getGraphData().links.length).toBe(10);

            vi.spyOn(manager, 'removeLinkProbability' as any).mockReturnValue(0);

            manager.removeLinks();
            expect(manager.getGraphData().links.length).toBe(10);
        });

        it('should remove some links based on probability', () => {
            const manager = new GraphManager(10);
            expect(manager.getGraphData().links.length).toBe(10);

            // Mock such that it returns 1 for even index links and 0 for odd
            const spy = vi.spyOn(manager, 'removeLinkProbability' as any);
            let callCount = 0;
            spy.mockImplementation(() => {
                return (callCount++ % 2 === 0) ? 1 : 0;
            });

            manager.removeLinks();
            // Since links are a Map and we iterate over values, order might vary but 5 should be removed
            expect(manager.getGraphData().links.length).toBe(5);
        });

        it('should remove nodes that become orphaned after link removal', () => {
            const manager = new GraphManager(1);
            const data = manager.getGraphData();
            const linkId = data.links[0].id;

            expect(data.nodes.length).toBe(2);

            manager.removeLink(linkId);

            const newData = manager.getGraphData();
            expect(newData.links.length).toBe(0);
            expect(newData.nodes.length).toBe(0); // Both nodes should be removed as they were only connected by this link
        });

        it('should cleanup all nodes when all links are removed via removeLinks', () => {
            const manager = new GraphManager(10);
            vi.spyOn(manager, 'removeLinkProbability' as any).mockReturnValue(1);

            manager.removeLinks();

            const data = manager.getGraphData();
            expect(data.links.length).toBe(0);
            expect(data.nodes.length).toBe(0);
        });

        describe('updateRemovalProbabilities', () => {
            it('should map slider values to logarithmic probabilities', () => {
                const manager = new GraphManager(1);

                // We'll use a density 2 link (initial link) to test different slider values
                const data = manager.getGraphData();
                const link = data.links[0];
                // Verify link density is 2 (source has 1 link, target has 1 link)
                expect(link.source.links.length + link.target.links.length).toBe(2);

                // Test Value 10 -> Probability 1
                manager.updateRemovalProbabilities(new Map([[2, 10]]));
                expect(manager['removeLinkProbability'](link)).toBeCloseTo(1);

                // Test Value 1 -> Probability 1e-5
                manager.updateRemovalProbabilities(new Map([[2, 1]]));
                expect(manager['removeLinkProbability'](link)).toBeCloseTo(1e-5, 6);

                // Test Value 0 -> Probability 0
                manager.updateRemovalProbabilities(new Map([[2, 0]]));
                expect(manager['removeLinkProbability'](link)).toBe(0);

                // Test Intermediate Value 5.5 -> Probability 10^-2.5 (~0.00316)
                manager.updateRemovalProbabilities(new Map([[2, 5.5]]));
                expect(manager['removeLinkProbability'](link)).toBeCloseTo(0.003162, 6);
            });

            it('should handle different density levels independently', () => {
                const manager = new GraphManager(1);

                // Map density 2 to 10 (Prob 1) and density 3 to 0 (Prob 0)
                manager.updateRemovalProbabilities(new Map([
                    [2, 10],
                    [3, 0]
                ]));

                const data = manager.getGraphData();
                const link2 = data.links[0]; // Density 2

                // Create a density 3 link
                const n1 = manager.newNode();
                const n2 = manager.newNode();
                const l3 = { id: 99, source: n1, target: n2 } as any;
                // Manually add links to n1 and n2 to reach total weight 3
                n1.links.push(l3);
                n2.links.push(l3);
                const extraLink = { id: 100, source: n2, target: manager.newNode() } as any;
                n2.links.push(extraLink); // n1 has 1, n2 has 2. Sum = 3.

                expect(manager['removeLinkProbability'](link2)).toBeCloseTo(1);
                expect(manager['removeLinkProbability'](l3)).toBe(0);
            });
        });
    });
});
