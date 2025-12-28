import pytest
import yaml
import os
from loader import load_nodes_from_yaml
from node import Node

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
    
    nodes = load_nodes_from_yaml(str(yaml_file))
    
    assert len(nodes) == 2
    nodes_list = sorted(list(nodes), key=lambda n: n.id)
    n1, n2 = nodes_list[0], nodes_list[1]
    
    assert n1.id == 1
    assert n1.coords == (10.0, 20.0, 30.0)
    assert n2 in n1.connections
    
    assert n2.id == 2
    assert n2.coords == (40.0, 50.0, 60.0)
    assert n1 in n2.connections

def test_load_nonexistent_file():
    with pytest.raises(FileNotFoundError):
        load_nodes_from_yaml("nonexistent.yaml")

def test_load_empty_file(tmp_path):
    yaml_file = tmp_path / "empty.yaml"
    with open(yaml_file, 'w') as f:
        pass
    nodes = load_nodes_from_yaml(str(yaml_file))
    assert len(nodes) == 0
