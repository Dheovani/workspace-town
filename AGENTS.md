# AGENTS.md

## Project context

This project is a virtual collaborative workspace inspired by Gather-style spatial interfaces.

The product goal is to allow users to:

* create and customize virtual rooms;
* place, move and configure furniture/items;
* customize their avatar/player;
* move through a shared 2D/isometric workspace;
* communicate through live audio/video calls;
* use meeting-specific flows for software teams, such as daily, planning, retro, review, pair programming and similar ceremonies.

The product is not just a video call app. It combines:

1. a web application;
2. a lightweight 2D room/game renderer;
3. real-time presence and movement;
4. live calls;
5. persistent room/workspace data;
6. meeting workflows for development teams.

## Current setup

The repository was initialized as a monorepo, and the current web app is under:

```txt
apps/web
```

The following commands have already been executed inside `apps/web`:

```bash
bun add pixi.js zustand zod @tanstack/react-query
bun add @livekit/components-react @livekit/components-styles livekit-client livekit-server-sdk
bun add drizzle-orm @neondatabase/serverless
bun add -d drizzle-kit tsx

bunx shadcn@latest init
```

Do not reinstall these dependencies unless there is a clear reason.

Use Bun as the package manager/runtime.

## Preferred stack

Use the following stack unless there is a strong reason not to:

* Monorepo: Turborepo-style structure
* Runtime/package manager: Bun
* Main app: Next.js + React + TypeScript
* Styling: Tailwind CSS
* UI components: shadcn/ui
* 2D renderer: PixiJS
* Client state: Zustand
* Server/query state: TanStack Query
* Validation: Zod
* Database: PostgreSQL, preferably Neon
* ORM: Drizzle ORM
* Live calls: LiveKit
* Realtime presence/movement: future WebSocket service, preferably Cloudflare Durable Objects or a separate realtime app

## Architectural principles

### React is not the game renderer

React should control application UI:

* pages;
* menus;
* panels;
* modals;
* room editor controls;
* participant list;
* meeting widgets;
* settings;
* forms.

PixiJS should control the room canvas:

* room grid;
* floor tiles;
* avatars;
* furniture;
* object ordering/depth;
* movement animations;
* pointer interaction inside the room.

Do not render the moving room scene as ordinary React components.

### Separate persistent data from ephemeral realtime state

Persistent data belongs in PostgreSQL:

* users;
* players/profiles;
* workspaces;
* workspace members;
* rooms;
* room settings;
* item definitions;
* placed room objects;
* permissions;
* meeting sessions;
* meeting notes;
* action items;
* call session history.

Ephemeral realtime data should not be primarily stored in PostgreSQL:

* current avatar position;
* current direction;
* who is online now;
* transient movement events;
* temporary mute/camera state;
* proximity state.

For the MVP, this ephemeral state may be simulated locally in the frontend. Later, it should move to a WebSocket/Durable Object/realtime service.

### Keep LiveKit separate from domain logic

LiveKit should be treated as the call provider, not as the whole meeting domain.

The domain model should have internal entities like:

* `callSessions`;
* `callParticipants`;
* `meetingSessions`;
* `meetingParticipants`.

Provider-specific data should be stored in fields such as:

* `provider`;
* `providerRoomName`;
* `providerParticipantId`;
* `metadata`.

This keeps the project flexible if the provider changes later.

## Suggested monorepo structure

Aim for this structure over time:

```txt
apps/
  web/
    src/
      app/
      components/
      features/
      lib/
      styles/
  realtime/
    # Future WebSocket/Durable Object app

packages/
  db/
    src/
      schema/
      index.ts
    drizzle.config.ts
  shared/
    src/
      schemas/
      types/
      constants/
  ui/
    src/
      components/
```

If the current repository does not yet have `packages/db` or `packages/shared`, create them only when useful for the current task. Do not over-engineer the project too early.

## Naming conventions

Prefer clear English names.

Use:

```txt
user_id
player_id
room_id
created_at
updated_at
is_public
position_x
position_y
avatar_config
```

Avoid legacy abbreviations like:

```txt
cdplayer
nmroom
fgpublic
vlposx
dtcreate
```

Use:

* `boolean` for flags;
* `timestamp` for dates with time;
* `jsonb` for flexible configs;
* enums or check constraints for roles/statuses when appropriate;
* UUID/CUID-style IDs or a consistent ID strategy across the project.

## Database domain model

The initial database model should move toward these entities:

### Identity and profile

```txt
users
players
playerSettings
```

`users` represent authentication/account data.

`players` represent the user's identity inside the virtual environment.

`avatar_config` should preferably be stored as JSON, not as a generated image file.

### Workspaces

```txt
workspaces
workspaceMembers
```

A workspace represents a team/company/project context.

Rooms should normally belong to a workspace.

### Rooms

```txt
rooms
roomSettings
roomMembers
roomPermissions
```

Rooms are persistent spaces.

Room settings include:

* theme;
* background color;
* light mode;
* guest access;
* chat permission;
* voice/video/screen share permission;
* max users;
* spawn point;
* navigation grid.

### Items and room objects

Separate available item definitions from placed objects.

```txt
itemDefinitions
roomObjects
```

`itemDefinitions` describe item types, such as chair, table, plant, whiteboard.

`roomObjects` are concrete instances placed inside a room.

Use `state jsonb` for flexible object state, such as color, label, locked state, open/closed state, etc.

### Chat

```txt
chatMessages
```

Messages may be:

* room messages;
* direct messages;
* system messages;
* meeting messages.

Allow nullable receiver for public room messages.

### Calls

```txt
callSessions
callParticipants
```

Use these to track LiveKit or any future provider.

### Meeting workflows

```txt
meetingTemplates
meetingSessions
meetingParticipants
meetingNotes
meetingActionItems
retroCards
```

These support daily, planning, retro and similar software development ceremonies.

## Feature boundaries

Prefer grouping feature code by domain:

```txt
features/room
features/room-editor
features/player
features/calls
features/meetings
features/chat
features/workspaces
```

For example:

```txt
src/features/room/
  components/
  hooks/
  stores/
  renderer/
  types.ts
```

PixiJS-specific code should live under something like:

```txt
src/features/room/renderer/
```

Avoid spreading PixiJS logic randomly across React components.

## MVP priorities

Implement the project in this order:

1. Basic Next.js app shell.
2. Room route.
3. PixiJS canvas mounted inside a client component.
4. Basic isometric or top-down grid.
5. Local player/avatar rendered on the canvas.
6. Local movement with keyboard or pointer.
7. Zustand store for room/player state.
8. Static furniture/item rendering.
9. Basic room editor data model.
10. Drizzle schema for persistent entities.
11. LiveKit token endpoint skeleton.
12. LiveKit room connection UI placeholder.
13. Meeting templates for daily/planning/retro.

Do not start with a full production realtime server. First build a local working room prototype.

## Code style

Use TypeScript.

Prefer:

* small modules;
* typed props;
* Zod schemas for external/input validation;
* clear feature boundaries;
* explicit return types for exported functions when useful;
* server-only code separated from client code;
* no unnecessary abstractions.

Avoid:

* `any` unless justified;
* huge components;
* mixing PixiJS rendering logic with form/UI logic;
* storing high-frequency movement in SQL;
* provider-specific domain lock-in;
* creating large systems before the MVP needs them.

## Next.js conventions

Use App Router.

Prefer server components by default.

Use `"use client"` only where necessary, especially for:

* PixiJS canvas;
* Zustand stores;
* LiveKit client components;
* browser APIs;
* keyboard/mouse interactions.

Keep LiveKit server SDK usage on the server side only.

Keep database access on the server side only.

## Environment variables

When implementing environment-dependent code, use clearly named variables such as:

```txt
DATABASE_URL
LIVEKIT_API_KEY
LIVEKIT_API_SECRET
LIVEKIT_URL
```

Do not hardcode secrets.

Add examples to `.env.example` when new variables are introduced.

## Drizzle guidance

Use Drizzle for database schema and queries.

Prefer a dedicated schema location, such as:

```txt
packages/db/src/schema
```

or, if keeping everything inside the app during the MVP:

```txt
apps/web/src/db/schema
```

Use a consistent naming strategy and avoid mixing different naming conventions.

Do not create destructive migrations unless explicitly requested.

## LiveKit guidance

Use LiveKit for audio/video calls.

For the MVP, create:

* a server endpoint for generating a LiveKit access token;
* a client component that can join a LiveKit room;
* a simple call panel with join/leave/mute placeholders.

Do not implement custom WebRTC manually.

## PixiJS guidance

Use PixiJS for the room renderer.

The first renderer should be simple and maintainable:

* create app;
* mount canvas;
* draw room grid;
* draw player;
* support basic movement;
* clean up Pixi app on unmount.

Keep PixiJS objects inside renderer classes/modules instead of deeply coupling them to React render cycles.

## Communication with the user

When making changes, explain:

1. what changed;
2. why it changed;
3. where the main files are;
4. how to run or test the change.

If a decision is uncertain, prefer implementing the smallest reasonable MVP and explain the tradeoff.

## Commands

Use Bun commands.

Common commands may include:

```bash
bun install
bun dev
bun run build
bun run lint
```

Before adding dependencies, check whether the project already has an equivalent library installed.

## Current immediate goal

The immediate goal is to create a minimal but solid foundation for the virtual workspace:

* app structure;
* room page;
* PixiJS canvas;
* local player movement;
* initial domain types;
* initial Drizzle schema;
* LiveKit token route skeleton;
* clean boundaries for future realtime and meeting systems.
