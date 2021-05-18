# App implementation notes

This document is a collection of implementation notes for the app.

## Changing the current game state through time

In order to continuously display game state updates to the user, e.g. a ticking countdown, the app needs to interpolate state values between two fetches of the current state from server. This can be implemented using the following `tick` method:

- The method updates the local, intermediate game state
- It is frequently called, e.g. on every animation frame

On every execution, the following algorithm is executed (pseudocode):

```python
lastUpdated = now()

def tick:
  current = now()

  if gameIsPaused:
    # game is paused, nothing can be done
    return

  if parameters[parameters <= 0]:
    # a game parameter is already zero which means game over. nothing can be done
    return

  for param in parameters:
    # update each parameter to its next intermediate value
    delta = current - lastUpdated
    param.value = param.value + param.rate * delta

  lastUpdated = current
```
