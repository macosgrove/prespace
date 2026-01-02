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

        manager.addLinks({ linkCount: 1, addNodeProbability: 1 });
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

        manager.addLinks({ linkCount: 1, addNodeProbability: 0 });
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

        manager.resetIfEmpty();
        const newData = manager.getGraphData();
        expect(newData.nodes.length).toBe(2);
        expect(newData.nodes[0].id).not.toBe(initialSourceId); // Should have a new persistent ID
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
    });
});
