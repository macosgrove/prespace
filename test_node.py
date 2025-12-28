import pytest
from node import Node

def test_node_initialization():
    node = Node(1, 10.0, 20.0, 30.0)
    assert node.id == 1
    assert node.x == 10.0
    assert node.y == 20.0
    assert node.z == 30.0
    assert len(node.connections) == 0

def test_node_connections():
    node1 = Node(1, 0, 0, 0)
    node2 = Node(2, 1, 1, 1)
    
    node1.add_connection(node2)
    
    assert node2 in node1.connections
    assert node1 in node2.connections
    assert len(node1.connections) == 1
    assert len(node2.connections) == 1

def test_unidirectional_connection():
    node1 = Node(1, 0, 0, 0)
    node2 = Node(2, 1, 1, 1)
    
    node1.add_connection(node2, bidirectional=False)
    
    assert node2 in node1.connections
    assert node1 not in node2.connections

def test_self_connection_prevention():
    node1 = Node(1, 0, 0, 0)
    node1.add_connection(node1)
    assert len(node1.connections) == 0

def test_node_equality():
    node1 = Node(1, 0, 0, 0)
    node2 = Node(1, 10, 10, 10)
    node3 = Node(2, 0, 0, 0)
    
    assert node1 == node2
    assert node1 != node3
    assert node1 in {node1}
    assert node2 in {node1}
