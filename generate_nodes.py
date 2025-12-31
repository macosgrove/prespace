import yaml
import random
from graph_utils import get_random_color

def generate_random_nodes(count):
    nodes = []
    for i in range(1, count + 1):
        x = round(random.uniform(0, 100), 2)
        y = round(random.uniform(0, 100), 2)
        z = round(random.uniform(0, 100), 2)
        
        # Determine number of connections (1 to 5)
        num_connections = random.randint(1, 5)
        
        # Pick random distinct potential neighbors (excluding self)
        potential_neighbors = [j for j in range(1, count + 1) if j != i]
        connections = random.sample(potential_neighbors, num_connections)
        
        nodes.append({
            'id': i,
            'coords': [x, y, z],
            'color': get_random_color(),
            'connections': sorted(connections)
        })
    
    return nodes

if __name__ == "__main__":
    num_nodes = 20
    node_data = generate_random_nodes(num_nodes)
    
    with open('nodes.yaml', 'w') as f:
        yaml.dump(node_data, f, default_flow_style=False, sort_keys=False)
    
    print(f"Successfully generated {num_nodes} nodes in nodes.yaml")
