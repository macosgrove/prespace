import networkx as nx
import random

def _get_random_color():
    return "#" + "".join([random.choice('0123456789ABCDEF') for _ in range(6)])

def add_random_node(G: nx.Graph) -> nx.Graph:
    """
    Adds a new node to the graph G.
    The node is connected to 1-5 random existing nodes.
    Returns the updated graph.
    """
    if not G.nodes:
        new_id = 1
    else:
        new_id = max(G.nodes) + 1
    
    # Random position (0-100 to match original generation)
    pos = (round(random.uniform(0, 100), 2), round(random.uniform(0, 100), 2))
    G.add_node(new_id, pos=pos, color=_get_random_color())
    
    # Get existing nodes to connect to
    existing_nodes = list(G.nodes)
    existing_nodes.remove(new_id)
    
    if existing_nodes:
        # Number of connections: 1 to 5, but capped by existing node count
        num_connections = random.randint(1, min(5, len(existing_nodes)))
        targets = random.sample(existing_nodes, num_connections)
        for target in targets:
            G.add_edge(new_id, target)
            
    return G
