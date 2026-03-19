# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start           # Start Expo development server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run web version
npm run lint        # Run ESLint
npm run reset-project  # Move example code to app-example/, create blank app
```

No test framework is configured.

## Architecture

This is an **Expo SDK 54 universal app** (iOS, Android, Web) using file-based routing via Expo Router. New Architecture and React Compiler are both enabled.

### Routing

Routes are defined by files under `app/`. The `(tabs)/` group renders as a bottom tab navigator. `_layout.tsx` files configure navigation at each level. The root layout wraps everything in a `ThemeProvider` and defines a Stack with the tab group and a modal screen.

### Theme System

- `constants/theme.ts` — centralized color tokens for light/dark modes and platform-specific fonts
- `hooks/use-theme-color.ts` — resolves the correct color given the active color scheme
- `hooks/use-color-scheme.ts` (+ `.web.ts`) — wraps React Native's color scheme with web hydration support
- `ThemedText` and `ThemedView` in `components/` are the standard building blocks for themed UI

### Platform Abstractions

- `components/ui/icon-symbol.tsx` — falls back to Material Icons on Android/web; `icon-symbol.ios.tsx` uses SF Symbols via `expo-symbols`
- `hooks/use-color-scheme.web.ts` — separate web implementation for static rendering hydration

### Path Aliases

`@/*` maps to the repo root (configured in `tsconfig.json`).
