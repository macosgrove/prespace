import pytest
import yaml
import os
import networkx as nx
from loader import load_nodes_from_yaml

def test_load_nodes_from_yaml(tmp_path):
    # Create a temporary YAML file
    test_data = [
        {
            'id': 1,
            'coords': [10.0, 20.0, 30.0],
            'connections': [2]
        },
        {
            'id': 2,
            'coords': [40.0, 50.0, 60.0],
            'connections': [1]
        }
    ]
    yaml_file = tmp_path / "test_nodes.yaml"
    with open(yaml_file, 'w') as f:
        yaml.dump(test_data, f)
    
    G = load_nodes_from_yaml(str(yaml_file))
    
    assert isinstance(G, nx.Graph)
    assert G.number_of_nodes() == 2
    # NetworkX handles undirected edges automatically; (1,2) and (2,1) become one edge
    assert G.number_of_edges() == 1
    
    # Verify IDs and positions
    assert 1 in G.nodes
    assert 2 in G.nodes
    assert G.nodes[1]['pos'] == (10.0, 20.0)
    assert G.nodes[2]['pos'] == (40.0, 50.0)

def test_load_nonexistent_file():
    with pytest.raises(FileNotFoundError):
        load_nodes_from_yaml("nonexistent.yaml")

def test_load_empty_file(tmp_path):
    yaml_file = tmp_path / "empty.yaml"
    with open(yaml_file, 'w') as f:
        pass
    G = load_nodes_from_yaml(str(yaml_file))
    assert G.number_of_nodes() == 0
    assert G.number_of_edges() == 0
