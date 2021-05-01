# Game Synchronization

This chapter provides all technical details on how the game state is computed and synchronized.

The app's main implementation challenge is that the game state should be two-way synchronized between all app instances: Every instance should be able to display the current state and globally modify it by scanning a QR code.

WebSockets are used as a simple, centralized, completely synchronized solution:

- Every app instance automatically connects to a central WebSocket server
- **QR-Scan:** When scanning a valid QR code, its data is sent to the server. If valid, it sends the new state to all app instances. If not, it sends an error to the submitting app.
- **Current game state:** The current game state is sent frequently to all app instances and after every successful QR scan. App instances automatically interpolate the game state between two transmissions.
- **Clock synchronization:** By frequently transmitting the current game state, no explicit clock synchronization is needed.
- **Connection loss, offline functionality**: QR codes can only be submitted online. On loss of connection, app instances automatically try to reconnect.
