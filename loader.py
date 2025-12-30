import yaml
import networkx as nx
import random

def _get_random_color():
    return "#" + "".join([random.choice('0123456789ABCDEF') for _ in range(6)])

def load_nodes_from_yaml(filepath: str) -> nx.Graph:
    """
    Reads a YAML file containing node data and returns a networkx Graph object.
    
    Expected YAML format:
    - id: 1
      coords: [x, y, z]  # Used for initial layout
      connections: [id2, id3, ...]
    """
    with open(filepath, 'r') as f:
        data = yaml.safe_load(f)
    
    G = nx.Graph()
    
    if not data:
        return G
    
    # First pass: Add all nodes with positions and colors
    for entry in data:
        node_id = entry['id']
        coords = entry.get('coords', [0.0, 0.0, 0.0])
        color = entry.get('color', _get_random_color())
        # Use 2D coordinates for visualization
        G.add_node(node_id, pos=(coords[0], coords[1]), color=color)
    
    # Second pass: Establish connections (edges)
    for entry in data:
        node_id = entry['id']
        connection_ids = entry.get('connections', [])
        
        for conn_id in connection_ids:
            G.add_edge(node_id, conn_id)
    
    return G

if __name__ == "__main__":
    # Example usage
    import os
    if os.path.exists('nodes.yaml'):
        G = load_nodes_from_yaml('nodes.yaml')
        print(f"Loaded {G.number_of_nodes()} nodes and {G.number_of_edges()} edges from nodes.yaml")
        if G.nodes:
            sample_node = list(G.nodes)[0]
            print(f"Sample node {sample_node} position: {G.nodes[sample_node]['pos']}")
