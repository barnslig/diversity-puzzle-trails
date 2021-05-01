# WebSocket Protocol

This document specifies the publish-subscribe protocol speaken on the WebSocket between app instances called _clients_ and the server.

## Client → Server messages

The following messages are sent from the clients to the server.

### Participate in a game

This messages subscribes the client to all following state updates of the game with the supplied ID.

Following this message, the server sends the current game state to the client.

#### Example

```json
{
  "type": "participate",
  "gameId": "cultures-interactive-summer-school-2021"
}
```

#### Type definition

```typescript
interface ParticipateMsg {
  /** Message type, should be "participate" */
  type: string;

  /** ID of the game to participate in */
  gameId: string;
}
```

### Clock control

This message controls the game's global clock.

If the client forgot to participate in the game before sending this message, it gets automatically subscribed.

Following this message, the server sends the current game state to _all_ clients.

#### Example

```json
{
  "type": "clock",
  "gameId": "cultures-interactive-summer-school-2021",
  "clockState": "running"
}
```

#### Type definition

```typescript
interface ClockMsg {
  /** Message type, should be "clock" */
  type: string;

  /** ID of the affected game */
  gameId: string;

  /** State to turn the clock into, should be either "running" or "paused" */
  clockState: string;
}
```

### Change Parameter

This message triggers a game state change and is usually caused by scanning a QR code.

If the client forgot to participate in the game before sending this message, it gets automatically subscribed.

Following this message, the server sends the current game state to _all_ clients.

This message can trigger the following server errors:

- `codeAlreadyUsed`
- `gameIsOver`

#### Example

```json
{
  "type": "changeParameter",
  "gameId": "cultures-interactive-summer-school-2021",
  "uid": "F0SA8vGdkDGgWbtqA6sMN",
  "oneShot": false,
  "parameterType": "foodSupply",
  "parameterAdd": 7
}
```

#### Type definition

```typescript
interface ChangeParameterMsg {
  /** Message type, should be "changeParameter" */
  type: string;

  /** ID of the affected game */
  gameId: string;

  /** Unique ID of the action */
  uid: string;

  /** Whether the action with this uid can only be executed once through the game */
  oneShot: boolean;

  /** Parameter to change */
  parameterType: string;

  /** Value which should be added/subtracted from the parameter, e.g. -2, 0 or 1 */
  parameterAdd: number;
}
```

## Server → Client messages

The following messages are sent from the server to the client.

### Game state

This message updates the client's game state.

It is frequently sent to all clients.

#### Example

```json
{
  "type": "state",
  "clockState": "running",
  "parameters": [
    {
      "type": "remainingTime",
      "value": 600,
      "rate": -1,
      "min": 0
    }
    // ...
  ]
}
```

#### Type Definition

```typescript
enum GameParameterType {
  RemainingTime = "remainingTime",
  FoodSupply = "foodSupply",
  Energy = "energy",
  Moral = "moral",
  Level = "level",
}

interface GameParameter {
  /** Type of the game parameter */
  type: GameParameterType;

  /** Current parameter value, e.g. 7 */
  value: number;

  /** Change per second, e.g. -0.001, 0 or 0.1 */
  rate: number;

  /** Minimum value, e.g. 0 */
  min?: number;

  /** Maximum value. e.g. 100 */
  max?: number;
}

interface StateMsg {
  /** Message type, should be "state" */
  type: string;

  /** Current clock state, either "running" or "paused" */
  clockState: string;

  /** Parameters with their current values */
  parameters: GameParameter[];
}
```

### Error

This message is sent to a client on an error.

The following `errorType`s are available:

- `codeAlreadyUsed`: When the code submitted via `changeParameter` is a one-shot-code and is already used.
- `gameIsOver`: When the game is already over, i.e. one of the parameters reached 0

#### Example

```json
{
  "type": "error",
  "errorType": "codeAlreadyUsed"
}
```

#### Type Definition

```typescript
interface ErrorMsg {
  /** Message type, should be "state" */
  type: string;

  /** Error type */
  errorType: string;
}
```
