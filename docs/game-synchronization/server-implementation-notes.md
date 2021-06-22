# Server implementation notes

This document is a collection of implementation notes for the server.

TODO:

- How the PubSub is efficiently implemented
- How a log of all `changeParameter` messages is kept
- How oneShot `changeParameter` messages are handled
- ...

## Changing the current parameter values through time

In order to continuously decrement the values of the parameter (according to clock speed and rate) the app needs to know how much time passed between to api calls. This can be implemented using the following `tick` method:

- The method updates all parameter
- It is called every time an api endpoint is requested

On every execution, the following algorithm is executed (pseudocode):


```python
last_time = time.time()


def tick(game):
    if game.clock.state == ClockType.RUNNING:
        current_time = time.time()
        passed_time_ms = (current_time - last_time) * 1000

        # Prevent high-frequency polling from overwhelming the database
        # as well as an litte edge-case where the values appear to be "froozen"
        if passed_time_ms < 500:
            return

        passed_tick = passed_time_ms / game.clock.speed
        last_time = current_time

        for parameter in game.parameter.all():
        	# Since the database stores integer, rounding is needed
            parameter.value -= round(passed_tick * parameter.rate)
            parameter.save()

    else:
        # Clock is not runnig, take no action
        pass
```
