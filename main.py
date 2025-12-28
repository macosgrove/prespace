import matplotlib.pyplot as plt
import matplotlib.patches as patches
import sys

def create_app():
    # Set window size (roughly matching 640x480)
    # Matplotlib uses inches, default dpi is usually 100
    fig, ax = plt.subplots(figsize=(6.4, 4.8), dpi=100)
    fig.canvas.manager.set_window_title('Prespace')
    
    # Hide axes
    ax.set_xlim(0, 640)
    ax.set_ylim(0, 480)
    ax.axis('off')
    # Invert Y axis to match typical screen coordinates (0 at top)
    ax.invert_yaxis()

    # Toolbar (Grey Rectangle)
    toolbar_height = 40
    rect = patches.Rectangle((0, 0), 640, toolbar_height, color='#e0e0e0', zorder=10)
    ax.add_patch(rect)

       
   
    # Hello World Text
    ax.text(320, 240, "Hello World!", color='blue', fontsize=40, 
            ha='center', va='center', zorder=5)

    def on_click(event):
        if event.xdata is not None and event.ydata is not None:
            # Check if click is within the close button area
            if (close_x <= event.xdata <= close_x + close_button_size and 
                close_y <= event.ydata <= close_y + close_button_size):
                plt.close(fig)

    fig.canvas.mpl_connect('button_press_event', on_click)
    
    return fig, ax

if __name__ == "__main__":
    create_app()
    plt.tight_layout(pad=0)
    plt.show()
