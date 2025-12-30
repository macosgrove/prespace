import matplotlib.pyplot as plt
import networkx as nx
from matplotlib.animation import FuncAnimation
from netgraph import InteractiveGraph
from loader import load_nodes_from_yaml
from graph_utils import add_random_node

def create_app():
    # Load nodes into a networkx graph
    G = load_nodes_from_yaml('nodes.yaml')
    
    # Set window size
    fig, ax = plt.subplots(figsize=(8, 6))
    fig.canvas.manager.set_window_title('Prespace - Dynamic Nodes')
    
    # Store plot_instance in a dictionary or list for mutable access in closure
    state = {
        'G': G,
        'plot': None
    }

    def update_plot():
        ax.clear()
        node_positions = nx.get_node_attributes(state['G'], 'pos')
        node_colors = nx.get_node_attributes(state['G'], 'color')
        
        state['plot'] = InteractiveGraph(
            state['G'], 
            edge_layout='curved',
            node_layout='spring',
            node_labels=True,
            node_size=2,
            node_color=node_colors,
            node_edge_width=0,
            edge_width=0.4,
            edge_color='gray',
            edge_alpha=1,
            node_draggable=True,
            ax=ax
        )
        ax.set_aspect('equal')
        ax.axis('off')

    # Initial plot
    update_plot()

    def update(frame):
        # Add a node every frame (every second)
        add_random_node(state['G'])
        update_plot()
        return []

    # interval=1000ms = 1 second
    ani = FuncAnimation(fig, update, interval=1000, cache_frame_data=False)

    return fig, ax, state, ani

if __name__ == "__main__":
    fig, ax, state, ani = create_app()
    plt.tight_layout()
    plt.show()
