import matplotlib.pyplot as plt
import matplotlib.patches as patches
from main import create_app

def test_app_structure():
    fig, ax = create_app()
    
    # Check if axis is created and limits are set correctly
    assert ax.get_xlim() == (0.0, 640.0)
    assert ax.get_ylim() == (480.0, 0.0) # Inverted Y axis
    
    # Verify toolbar rectangle
    rects = [p for p in ax.patches if isinstance(p, patches.Rectangle)]
    assert len(rects) == 1
    rect = rects[0]
    assert rect.get_width() == 640
    assert rect.get_height() == 40
    assert rect.get_facecolor() == (224/255, 224/255, 224/255, 1.0) # #e0e0e0
    
    # Verify "X" lines
    lines = ax.get_lines()
    assert len(lines) == 2
    for line in lines:
        assert line.get_color() == 'red'
        assert line.get_linewidth() == 3
        
    # Verify "Hello World" text
    texts = ax.texts
    assert len(texts) == 1
    assert texts[0].get_text() == "Hello World"
    assert texts[0].get_color() == 'blue'
    
    plt.close(fig)

if __name__ == "__main__":
    test_app_structure()
    print("Test passed!")
