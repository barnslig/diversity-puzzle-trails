# Game Synchronization

This chapter provides all technical details on how the game state is computed and synchronized.

The app's main implementation challenge is that the game state should be two-way synchronized between all app instances: Every instance should be able to display the current state and globally modify it by scanning a QR code.

A HTTP API is used as a simple, centralized, completely synchronized solution:

- Every app instance frequently requests the current game and clock state from the HTTP API
- **QR-Scan:** When scanning a valid QR code, its reference is looked up using the HTTP API. If valid, the server updates its state.
- **Current game state:** Every app instance frequently requests the current game and clock state using the HTTP API. They _may_ automatically interpolate the game state between two transmissions.
- **Clock synchronization:** By frequently transmitting the current game state, no explicit clock synchronization is needed. However, whether the game is currently running at its speed can be fetched using the HTTP API for the game state interpolation.
- **Connection loss, offline functionality**: QR codes can only be submitted online. On loss of connection, app instances automatically try to call the HTTP API when online again.
- **Real-Time updates**: It should be sufficient if app instances only update to the actual state every ~30s or so. However, for a faster synchronization, a separate notification channel like a WebSocket could be used to notify clients to refetch the HTTP API data.
