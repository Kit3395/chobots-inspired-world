# Architecture contract — prototype v0.1

## Scope
Local, single-player browser prototype only.

## Approved initial stack
- Phaser 3 for 2D game rendering and input.
- TypeScript for game code.
- Vite for local development and static production build.

## Boundaries
- Game scene and world logic live in `src/main.ts` initially; split modules when there is a concrete need.
- Styling and shell UI live in `src/style.css` and `index.html`.
- No backend, account system, database, payments, or third-party analytics in this phase.

## Security and rights
- No secrets in source control.
- No original Chobots source or assets without verified permission.
- Do not run the archived project on the host machine.

## Acceptance criteria
- `npm run typecheck` succeeds.
- `npm run build` succeeds.
- `npm run dev` serves the game locally.
- Player can move with WASD and arrow keys.
- Player is constrained to world bounds and blocked by map obstacles.

## Changes requiring review
Adding multiplayer, persistent storage, authentication, new services, or external asset packs requires a documented design update before implementation.
