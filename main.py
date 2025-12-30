import sys
import os
from loader import load_nodes_from_yaml

def create_visualisation(yaml_path='nodes.yaml', output_path='nx.html'):
    """
    Loads nodes from YAML and generates an interactive HTML visualization using pyvis.
    """
    if not os.path.exists(yaml_path):
        print(f"Error: {yaml_path} not found.")
        return

    print(f"Loading nodes from {yaml_path}...")
    net = load_nodes_from_yaml(yaml_path)
    
    # Set some options for better visualization
    net.toggle_physics(True)
    
    print(f"Generating visualization at {output_path}...")
    # notebook=False is required for generating a standalone HTML file
    net.show(output_path, notebook=False)
    print("Done.")

if __name__ == "__main__":
    create_visualisation()
