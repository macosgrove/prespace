import matplotlib.pyplot as plt
import networkx as nx
from matplotlib.animation import FuncAnimation
from matplotlib.widgets import Button
from netgraph import InteractiveGraph
from loader import load_nodes_from_yaml
from graph_utils import add_random_node

def create_app():
    # Load nodes into a networkx graph
    G = load_nodes_from_yaml('nodes.yaml')
    
    # Set window size
    fig, ax = plt.subplots(figsize=(8, 6))
    fig.canvas.manager.set_window_title('Prespace - Dynamic Nodes')
    # Adjust plot area to make room for button at the bottom
    plt.subplots_adjust(bottom=0.2)
    
    # Store state in a dictionary
    state = {
        'G': G,
        'plot': None,
        'paused': False
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
        if not state['paused']:
            # Add a node every frame (every second)
            add_random_node(state['G'])
            update_plot()
        return []

    # interval=1000ms = 1 second
    ani = FuncAnimation(fig, update, interval=1000, cache_frame_data=False)

    # Add Pause/Resume Button
    ax_button = plt.axes([0.45, 0.05, 0.1, 0.075])
    btn = Button(ax_button, 'Pause')

    def toggle_pause(event):
        state['paused'] = not state['paused']
        btn.label.set_text('Resume' if state['paused'] else 'Pause')
        fig.canvas.draw_idle()

    btn.on_clicked(toggle_pause)

    return fig, ax, state, ani, btn

if __name__ == "__main__":
    fig, ax, state, ani, btn = create_app()
    plt.show()
