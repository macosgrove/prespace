# PreSpace 3D Force Graph

An interactive, dynamic 3D force-directed graph visualization built with [3d-force-graph](https://github.com/vasturiano/3d-force-graph) and [Vite](https://vitejs.dev/), with assistance from Google Antigravity and Gemini Flash.

If you want to know how the universe really works, then it is best to avoid infinities. A fundamental description should tell you how to build up universal structure from some basic, discrete components. Any explanation that includes a realised infinity, or infinitesimal, within it should be regarded as unphysical – infinities cannot be built.

Mathematical operations such as calculus and continuous functions – and physical theories or models based on them – are doubtless very powerful tools; but since they rely on infinities and infinitesimals, cannot be a fundamental part of our universe’s structure. These will form effective or approximate theories. The foundational or underlying makeup of our reality is more likely to resemble cellular automata, or a structured graph, composed of discrete units that are as simple as possible – with the simplest possible unit being a 1-bit element (it has no internal characteristics, apart from just existing or not existing).

We attempt to visualise such a foundational configuration through a directed graph, with each time step involving stochastic change, removing or adding links to a network of nodes these links comprise. The probability of any of these fundamental links continuing to exist over time is set to depend on various features such as their local connectivity density. A reasonable conjecture is that our universe could be the result of a structure-preserving code or rule (for maintaining sets of connections within such an underlying ‘pre-space’ out of which standard space-time is then formed) that has evolutionarily emerged on the stochastic background process. This simulation will aim to investigate possible network parameters that might optimise structure persistence on this modelled PreSpace. 


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
