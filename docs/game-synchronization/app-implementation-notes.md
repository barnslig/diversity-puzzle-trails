# App implementation notes

This document is a collection of implementation notes for the app.

## Keeping the current game state

The current game state is kept within a [Redux slice](https://redux-toolkit.js.org/api/createSlice).

## Changing the current game state through time

In order to continuously display game state updates to the user, e.g. a ticking countdown, the app needs to interpolate state values between two transmissions of the current state from server. This is implemented as follows:

- The redux slice representing the game state implements a `tick` reducer function
- The redux slice has a state value containing the local UNIX timestamp of the last state update
- The `tick` reducer is called approximately every second, for example using `setInterval`

On every tick, the following computations are made:

- First, it is checked whether the game is paused. If it is paused, nothing happens.
- Then, it is checked if any game state value is 0. **If yes, no values can be updated as the game is already over.**
- Finally, for each value, if the value has not already reached its minimum or maximum, it is updated according to the following formula:

```javascript
const delta = now - state.lastUpdated;
param.value = param.value + param.rate * delta;
```

## Changing the current game through QR codes

The operations encoded in a QR code are applied locally and, if they modify global game state, sent to the server.

## Reconnecting the WebSocket on wonky connections

The WebSocket should automatically reconnect with no data loss using the library [pladaria/reconnecting-websocket](https://github.com/pladaria/reconnecting-websocket).

Eventually, we should implement a heartbeat system to further improve reliability.
