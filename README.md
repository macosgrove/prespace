# PreSpace 3D Force Graph

An interactive, dynamic 3D force-directed graph visualization built with [3d-force-graph](https://github.com/vasturiano/3d-force-graph) and [Vite](https://vitejs.dev/), with assistance from Google Antigravity and Gemini Flash.

## Features

- **Dynamic Growth**: Adds a new node and link every second automatically.
- **Interactive Deletion**: Click any node to remove it and its associated links.
- **Persistent ID Management**: Robust state handling via `GraphManager` to prevent crashes during rapid deletions.
- **Premium UI**: Dark mode, glassmorphism stats panel, and smooth camera controls.

<img width="1283" height="981" alt="Screenshot 2026-01-02 at 5 39 05 pm" src="https://github.com/user-attachments/assets/d1c6fc7a-7ddc-4659-b225-3b2bef39c828" />

## Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [NPM](https://www.npmjs.com/)

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

## Running the Application

To start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`.

## Usage

- **Viewing**: The graph will automatically populate with nodes and links.
- **Navigation**:
  - **Rotate**: Left-click and drag.
  - **Zoom**: Scroll wheel.
  - **Pan**: Right-click and drag.
- **Interact**:
  - **Delete Node**: Left-click on any node.
  - **Pause/Resume**: Use the UI button in the bottom-left panel.
  - **Reset View**: Use the "Reset View" button to center the graph.

## Testing

To run the automated logic tests:
```bash
npm test
```
