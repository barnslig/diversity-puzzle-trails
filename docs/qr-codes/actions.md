# Available QR Code Actions

This document specifies which types of QR code actions are available.

QR code actions remain universal across games and thus contain no game id, except for the participate code.

## Participate in a game

This action sets in which game the app participates.

### Example

```json
{
  "type": "participate",
  "gameId": "cultures-interactive-summer-school-2021"
}
```

### Type definition

```typescript
interface GameCodeActionParticipate {
  type: "participate";

  /** ID of the game to participate in */
  gameId: string;
}
```

## Change Parameter

This action updates a game state parameter.

### Example

```json
{
  "type": "changeParameter",
  "parameter": "foodSupply",
  "add": 7
}
```

### Type definition

```typescript
interface GameCodeActionChangeParameter {
  type: "changeParameter";

  /** Parameter to change */
  parameter: string;

  /** Value which should be added/subtracted from the parameter, e.g. -2, 0 or 1 */
  add: number;
}
```

## Information

This action shows an information to the user.

TODO: What kind of information and how is it served?

### Example

```json
{
  "type": "information"
}
```

### Type definition

```typescript
interface GameCodeActionInformation {
  type: "information";
}
```

## Poll

This code lets the user take part in a poll.

TODO: How do polls work?

### Example

```json
{
  "type": "poll"
}
```

### Type definition

```typescript
interface GameCodeActionPoll {
  type: "poll";
}
```
