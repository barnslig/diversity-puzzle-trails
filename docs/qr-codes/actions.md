# Available QR Code Actions

This document specifies which QR code actions are available.

QR code actions remain universal across games and thus contain no game id.

## Types of QR code actions

There are four types of actions:

- Change Parameter
- Get Information
- Send Message
- Set Character

To be considered in the future:

- Polls

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

## Get Information

This action shows an information to the user.

### Example

```json
{
  "type": "getInformation"
  // TODO what kind of information and how is it served?
}
```

## Send Message

This action sends a message to all users.

### Example

```json
{
  "type": "sendMessage",
  "message": "Hallo Welt!"
}
```

## Set Character

This action sets the bonus/malus for a player based on a character.

### Example

```json
{
  "type": "setCharacter",
  "character": "engineer"
  // TODO define bonus/malus
}
```
