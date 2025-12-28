import yaml
import random

def generate_random_nodes(count=100):
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
            'connections': sorted(connections)
        })
    
    return nodes

if __name__ == "__main__":
    node_data = generate_random_nodes(100)
    
    with open('nodes.yaml', 'w') as f:
        yaml.dump(node_data, f, default_flow_style=False, sort_keys=False)
    
    print(f"Successfully generated 100 nodes in nodes.yaml")
