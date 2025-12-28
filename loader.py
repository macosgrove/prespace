import yaml
from typing import Set, Dict
from node import Node

def load_nodes_from_yaml(filepath: str) -> Set[Node]:
    """
    Reads a YAML file containing node data and returns a set of Node objects.
    
    Expected YAML format:
    - id: 1
      coords: [x, y, z]
      connections: [id2, id3, ...]
    """
    with open(filepath, 'r') as f:
        data = yaml.safe_load(f)
    
    if not data:
        return set()
    
    # First pass: Create all Node objects
    nodes_by_id: Dict[int, Node] = {}
    for entry in data:
        node_id = entry['id']
        coords = entry['coords']
        nodes_by_id[node_id] = Node(node_id, coords[0], coords[1], coords[2])
    
    # Second pass: Establish connections
    for entry in data:
        node_id = entry['id']
        current_node = nodes_by_id[node_id]
        connection_ids = entry.get('connections', [])
        
        for conn_id in connection_ids:
            if conn_id in nodes_by_id:
                # Using the default bidirectional=True from Node class
                current_node.add_connection(nodes_by_id[conn_id])
    
    return set(nodes_by_id.values())

if __name__ == "__main__":
    # Example usage
    import os
    if os.path.exists('nodes.yaml'):
        nodes = load_nodes_from_yaml('nodes.yaml')
        print(f"Loaded {len(nodes)} nodes from nodes.yaml")
        if nodes:
            sample_node = next(iter(nodes))
            print(f"Sample node: {sample_node}")
