# Little World — Chobots-inspired local prototype

A browser-first 2D virtual-world prototype using Phaser 3, TypeScript, and Vite. This is an independent implementation with simple scenery and a placeholder avatar drawn in code. It contains no original Chobots source code or artwork.

## Requirements
- Node.js 20 LTS or newer
- npm
- Git (optional for local version control; this repository is already on GitHub)

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite, normally http://127.0.0.1:5173.

## Verify
```bash
npm run typecheck
npm run build
```

## Controls
- Move with WASD or arrow keys.
- Explore the plaza and avoid trees and buildings.

## Current scope
- One locally rendered map
- One placeholder character
- Keyboard movement and basic obstacle collision
- Responsive page shell and HUD

## Not implemented
- Accounts or saved progress
- Multiplayer or chat
- Inventory, currency, shops, or mini-games
- Production hosting or backend services

## Licensing and source policy
This is a clean implementation. The original Chobots preservation repository is for research only until rights and licensing are verified: https://github.com/Chobots/Chobots

Do not add original Chobots code, branding, art, music, maps, or other protected assets unless reuse permission and applicable licenses have been confirmed.

## Next steps
1. Run and test the local prototype.
2. Fix any typecheck/build or gameplay issues.
3. Document architecture before introducing multiplayer.
