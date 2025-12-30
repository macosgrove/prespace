import pytest
import yaml
import os
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
    
    net = load_nodes_from_yaml(str(yaml_file))
    
    # Pyvis Network nodes are stored in a list of dicts or objects
    # and edges are stored in a list of dicts
    assert len(net.nodes) == 2
    # Since pyvis Network is undirected by default, it collapses (1,2) and (2,1) into one edge
    assert len(net.edges) == 1
    
    # Verify IDs are present as strings (we converted them in loader.py)
    node_ids = {str(n['id']) for n in net.nodes}
    assert '1' in node_ids
    assert '2' in node_ids

def test_load_nonexistent_file():
    with pytest.raises(FileNotFoundError):
        load_nodes_from_yaml("nonexistent.yaml")

def test_load_empty_file(tmp_path):
    yaml_file = tmp_path / "empty.yaml"
    with open(yaml_file, 'w') as f:
        pass
    net = load_nodes_from_yaml(str(yaml_file))
    assert len(net.nodes) == 0
    assert len(net.edges) == 0
