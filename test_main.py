import os
import matplotlib.pyplot as plt
from main import create_app
from netgraph import InteractiveGraph

def test_create_app(tmp_path):
    # Ensure nodes.yaml exists for the test or is mocked
    yaml_file = "nodes.yaml"
    
    # If nodes.yaml doesn't exist, create a dummy one in the current working directory
    # (since create_app currently hardcodes 'nodes.yaml')
    created_dummy = False
    if not os.path.exists(yaml_file):
        import yaml
        dummy_data = [{'id': 1, 'coords': [0, 0, 0], 'connections': []}]
        with open(yaml_file, 'w') as f:
            yaml.dump(dummy_data, f)
        created_dummy = True
    
    try:
        fig, ax, plot = create_app()
        
        # Verify types
        assert isinstance(fig, plt.Figure)
        assert isinstance(ax, plt.Axes)
        assert isinstance(plot, InteractiveGraph)
        
        # Verify basic graph properties from dummy/existing data
        assert len(plot.node_positions) > 0
        
        # Close the figure to avoid memory issues during tests
        plt.close(fig)
        
    finally:
        if created_dummy:
            os.remove(yaml_file)

if __name__ == "__main__":
    import pytest
    pytest.main([__file__])

    # Getting divide by zero error at netgraph/_utils.py:360. See https://github.com/paulbrodersen/netgraph/issues/81 
