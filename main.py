import matplotlib.pyplot as plt
import networkx as nx
from netgraph import InteractiveGraph
from loader import load_nodes_from_yaml

def create_app():
    # Load nodes into a networkx graph
    G = load_nodes_from_yaml('nodes.yaml')
    
    # Extract positions from graph attributes
    node_positions = nx.get_node_attributes(G, 'pos')
    
    # Set window size
    fig, ax = plt.subplots(figsize=(8, 6))
    fig.canvas.manager.set_window_title('Prespace - Interactive Nodes')
    
    # Create the interactive graph
    # node_draggable=True allows moving nodes around
    plot_instance = InteractiveGraph(
        G, 
        node_layout=node_positions, 
        node_labels=True,
        node_size=50,
        node_color='blue',
        edge_width=10,
        edge_color='pink',
        edge_alpha=1,
        node_draggable=True,
        ax=ax
    )
    
    ax.set_aspect('equal')
    ax.axis('off')

    return fig, ax, plot_instance

if __name__ == "__main__":
    fig, ax, plot = create_app()
    plt.tight_layout()
    plt.show()
