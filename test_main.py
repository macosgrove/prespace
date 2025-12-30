import os
from main import create_visualisation

def test_visualisation_generation(tmp_path):
    # Use a temporary file path for the output
    output_file = tmp_path / "test_nx.html"
    yaml_file = "nodes.yaml" # Assuming nodes.yaml exists as it's the default
    
    # If nodes.yaml doesn't exist, we might need to skip or mock it
    if not os.path.exists(yaml_file):
        # Create a dummy nodes.yaml if it doesn't exist for the test
        import yaml
        dummy_data = [{'id': 1, 'coords': [0, 0, 0], 'connections': []}]
        yaml_file = tmp_path / "dummy_nodes.yaml"
        with open(yaml_file, 'w') as f:
            yaml.dump(dummy_data, f)
    
    create_visualisation(yaml_path=str(yaml_file), output_path=str(output_file))
    
    # Check if the output file was created
    assert os.path.exists(str(output_file))
    # Check if it has some content
    assert os.path.getsize(str(output_file)) > 0

if __name__ == "__main__":
    import pytest
    pytest.main([__file__])
