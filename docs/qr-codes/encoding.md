# Encoding of Actions into QR Codes

This document specifies how actions are encoded into QR codes.

## Data structure of a single code

Each code has a unique [Nano ID](https://github.com/ai/nanoid). It is primarily used to implement the `oneShot` parameter.

Each code can contain multiple actions. See [QR Code Actions](./actions.md) for available actions.

### Example

```json
{
  "type": "code",
  "uid": "pJ6sLbnIDDlthmj8OWu8j",
  "oneShot": false,
  "actions": [
    {
      "type": "changeParameter",
      "parameterType": "foodSupply",
      "parameterAdd": 7
    },
    {
      "type": "changeParameter",
      "parameterType": "charakter",
      "parameterAdd": 2
    }
  ]
}
```

### Type definition

```typescript
type GameCodeAction =
  | GameCodeActionParticipate
  | GameCodeActionChangeParameter
  | GameCodeActionInformation
  | GameCodeActionPoll;

interface GameCode {
  /** QR code type, should be "code" */
  type: string;

  /** Unique ID of the code */
  uid: string;

  /** Whether the code with this uid can only be executed once through the game */
  oneShot: boolean;

  /** Actions that this code triggers */
  actions: GameCodeAction[];
}
```

## Action serialization

QR codes are limited in size and tend to get harder to print and scan with each added charakter. Thus, different serialization algorithms need to be considered.

In order to accommodate for further improvements, different serialization algorithms may be used, each identifying itself with a magic signature.

### Example

```
DPT,JSON:{"uid": "pJ6sLbnIDDlthmj8OWu8j", ...}
```

### Magic Signature format

The magic signature is as follows:

```
DPT,[SERIALIZATION ALGO ID]:[SERIALIZED DATA]
```

### Available Serialization

The following serialization algorithms are available:

| ID   | Algorithm                                            |
| ---- | ---------------------------------------------------- |
| JSON | JSON, [RFC8259](https://tools.ietf.org/html/rfc8259) |

### Serialization algorithms to consider

The following algorithms should be considered to get smaller QR codes:

1. Binary encoding using [Protocol Buffers](https://developers.google.com/protocol-buffers)
1. Binary encoding using [CBOR](https://cbor.io/)
1. Binary encoding using [MessagePack](https://github.com/msgpack/msgpack)
1. Text encoding using a custom [MeCard](<https://en.wikipedia.org/wiki/MeCard_(QR_code)>) style encoding, like for WiFI QR codes
