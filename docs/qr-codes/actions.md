# Available QR Code Actions

This document specifies which QR code actions are available.

QR code actions remain universal across games and thus contain no game id.

## Types of QR code actions

There are four types of actions:

- Change Parameter
- Get Character
- Get Information
- Send Message

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

## Get Character

This action gets the bonus/malus for a character.

### Example

```json
{
  "type": "getCharacter",
  "character": "engineer"
  // TODO define bonus/malus
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
