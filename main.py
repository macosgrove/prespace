import matplotlib.pyplot as plt
import matplotlib.patches as patches
import sys
from loader import load_nodes_from_yaml

def create_app():
    # Set window size (roughly matching 640x480)
    fig, ax = plt.subplots(figsize=(6.4, 4.8), dpi=100)
    fig.canvas.manager.set_window_title('Prespace')
    
    # Set limits for node data (0-100 range from generator) plus some padding
    ax.set_xlim(-5, 105)
    ax.set_ylim(-5, 105)
    ax.set_aspect('equal')
    ax.axis('off')

    # Load nodes
    nodes = load_nodes_from_yaml('nodes.yaml')

    # Plot connections
    seen_connections = set()
    for node in nodes:
        for other in node.connections:
            # Sort IDs to avoid drawing the same line twice
            conn = tuple(sorted((node.id, other.id)))
            if conn not in seen_connections:
                ax.plot([node.x, other.x], [node.y, other.y], 
                        color='gray', linewidth=0.5, alpha=0.5, zorder=1)
                seen_connections.add(conn)

    # Plot nodes
    xs = [n.x for n in nodes]
    ys = [n.y for n in nodes]
    ax.scatter(xs, ys, color='blue', s=20, zorder=2)

    return fig, ax

if __name__ == "__main__":
    create_app()
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    create_app()
    plt.tight_layout(pad=0)
    plt.show()
