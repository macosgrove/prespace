import yaml
from pyvis.network import Network

def load_nodes_from_yaml(filepath: str) -> Network:
    """
    Reads a YAML file containing node data and returns a pyvis Network object.
    
    Expected YAML format:
    - id: 1
      coords: [x, y, z]  # Ignored
      connections: [id2, id3, ...]
    """
    with open(filepath, 'r') as f:
        data = yaml.safe_load(f)
    
    net = Network()
    
    if not data:
        return net
    
    # First pass: Add all nodes
    for entry in data:
        node_id = str(entry['id'])
        net.add_node(node_id, label=node_id)
    
    # Second pass: Establish connections (edges)
    for entry in data:
        node_id = str(entry['id'])
        connection_ids = entry.get('connections', [])
        
        for conn_id in connection_ids:
            net.add_edge(node_id, str(conn_id))
    
    return net

if __name__ == "__main__":
    # Example usage
    import os
    if os.path.exists('nodes.yaml'):
        net = load_nodes_from_yaml('nodes.yaml')
        print(f"Loaded {len(net.nodes)} nodes and {len(net.edges)} edges from nodes.yaml")
        if net.nodes:
            sample_node = net.nodes[0]
            print(f"Sample node: {sample_node}")
