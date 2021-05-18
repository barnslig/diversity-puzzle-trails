# Encoding of QR Codes

This document specifies the contents of our QR codes.

## Types of QR codes

There are two types of QR codes:

- Onboarding QR code
- Game action QR codes

## Onboarding QR code

This QR code is scanned by the user using the built-in Camera app, Chrome app or an arbitrary QR code scanner app.

The code contains an URL with a game id to our app. When scanned, our app opens.

### Example contents

```
https://abc-dpt.netlify.app/start/cultures-interactive-summer-school-2021
```

## Game action QR codes

These QR codes are scanned during the game by the users.

They contain an URL with an action reference to our app. When scanned within our app, the action is processed.

As it contains an URL to our app, it still can be processed if scanned using another qr code scanner by mistake.

The app then requests what this QR code actually does and eventually executes it using the [API](../game-synchronization/API.md).

### Example contents

```
https://abc-dpt.netlify.app/code/pJ6sLbnIDDlthmj8OWu8j
```
