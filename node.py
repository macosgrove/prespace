from typing import Set, Tuple


class Node:
    """
    Represents a node in space with a unique identifier and 3D coordinates.
    Nodes can be connected to other nodes.
    """

    def __init__(self, node_id: int, x: float, y: float, z: float):
        self.id = node_id
        self.coords: Tuple[float, float, float] = (x, y, z)
        self.connections: Set['Node'] = set()

    @property
    def x(self) -> float:
        return self.coords[0]

    @property
    def y(self) -> float:
        return self.coords[1]

    @property
    def z(self) -> float:
        return self.coords[2]

    def add_connection(self, other: 'Node', bidirectional: bool = True):
        """Adds a connection to another node."""
        if other == self:
            return
        self.connections.add(other)
        if bidirectional:
            other.connections.add(self)

    def remove_connection(self, other: 'Node', bidirectional: bool = True):
        """Removes a connection to another node."""
        if other in self.connections:
            self.connections.remove(other)
        if bidirectional and (self in other.connections):
            other.connections.remove(self)

    def __repr__(self) -> str:
        return f"Node(id={self.id}, x={self.x}, y={self.y}, z={self.z}, connections={[n.id for n in self.connections]})"

    def __hash__(self):
        return hash(self.id)

    def __eq__(self, other):
        if not isinstance(other, Node):
            return False
        return self.id == other.id
