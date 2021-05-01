# QR Codes

This chapter provides all technical details on how game actions are encoded into QR codes.

The following assumptions are made:

- The game is completely modified and controlled via QR codes that contain all action details. There is no separate "control panel" for the backend or anything
- Every QR code can contain >= 1 actions, i.e. one code may trigger multiple actions
- Actions from a QR code are processed in order
