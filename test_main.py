import matplotlib.pyplot as plt
import matplotlib.collections as mcoll
from main import create_app

def test_app_structure():
    fig, ax = create_app()
    
    # Check if limits are set correctly (with padding)
    assert ax.get_xlim() == (-5.0, 105.0)
    assert ax.get_ylim() == (-5.0, 105.0)
    
    # Verify nodes (scatter plot uses PathCollection)
    collections = [c for c in ax.collections if isinstance(c, mcoll.PathCollection)]
    assert len(collections) >= 1
    # Check number of points (should be 100)
    assert len(collections[0].get_offsets()) == 100
    
    # Verify connections (lines)
    lines = ax.get_lines()
    assert len(lines) > 0 # Should have many connection lines
    for line in lines:
        assert line.get_color() == 'gray'
        assert line.get_alpha() == 0.5
    
    # Verify "Hello World" is NOT present
    assert len(ax.texts) == 0
    
    plt.close(fig)

if __name__ == "__main__":
    test_app_structure()
    print("Test passed!")

if __name__ == "__main__":
    test_app_structure()
    print("Test passed!")
