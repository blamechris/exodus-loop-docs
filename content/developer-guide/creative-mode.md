---
title: Creative Mode
---

# Creative Mode

Creative Mode is a sandbox/testing feature that enables controlling both teams during Intent Battle. Useful for testing game systems, balance tuning, and manual E2E testing.

## Enabling Creative Mode

1. Open **Fleet Setup** screen
2. Click the **Creative** toggle button in the header (turns gold when enabled)
3. Load a preset or configure your battle
4. Click **Start Battle**

---

## Creative Mode Controls

When Creative Mode is active, a control panel appears in the battle screen:

| Control | Action |
|---------|--------|
| **SWITCH TEAM [Tab]** | Toggle control between Team A and Team B |
| **Reveal Fog** | Show all hidden enemy units |
| **Detection Overlay** | Visualize sensor ranges for all ships |

### Two-Team Commit Flow

In Creative Mode, both teams must commit before the turn resolves:

1. Issue orders for **Team A**
2. Click **COMMIT** → Auto-switches to Team B
3. Issue orders for **Team B**
4. Click **COMMIT** → Turn resolves
5. Next turn starts with Team A

---

## Built-in Test Presets

Creative Mode works with the preset system. Load these presets for targeted testing:

### Combat Systems

| Preset | Purpose | Configuration |
|--------|---------|---------------|
| **RPS Triangle** | Test type advantages | 3v3: Interceptor, Gunship, Bomber each side |
| **Combat Stress Test** | Performance testing | 15x15 grid, 12+ ships per side |

### Carrier Operations

| Preset | Purpose | Configuration |
|--------|---------|---------------|
| **Carrier Duel** | Launch/recover mechanics | 2 carriers per side with docked fighters |
| **Escort Protection** | Escort AI priorities | 3 civilian escorts with fighter protection |

### Fog of War

| Preset | Purpose | Configuration |
|--------|---------|---------------|
| **Fog of War Test** | Sensor ranges, detection | 14x15 grid with scattered enemies |
| **Hazard Gauntlet** | Navigation, hazards | 13x14 grid with all hazard types |

---

## Manual E2E Testing Checklist

Use Creative Mode for manual validation of game systems.

### RPS Combat Validation

```
[ ] Load "RPS Triangle" preset
[ ] Enable Creative Mode
[ ] Move Interceptor to attack Bomber
[ ] Verify Interceptor has advantage (higher damage)
[ ] Move Bomber to attack Gunship
[ ] Verify Bomber has advantage
[ ] Move Gunship to attack Interceptor
[ ] Verify Gunship has advantage
```

### Carrier Operations Validation

```
[ ] Load "Carrier Duel" preset
[ ] Enable Creative Mode
[ ] Select carrier → verify LAUNCH mode available
[ ] Issue LAUNCH command → fighter deploys from bay
[ ] Move deployed fighter around grid
[ ] Return fighter to carrier → verify LAND works
[ ] Verify fighter returns to hangar bay
```

### Fog of War Validation

```
[ ] Load "Fog of War Test" preset
[ ] Enable Creative Mode
[ ] Toggle "Detection Overlay" on
[ ] Verify Scout shows range 3 (larger circle)
[ ] Verify Interceptors show range 1 (small circle)
[ ] Verify Carrier shows range 2
[ ] Move Scout toward hidden enemies
[ ] Verify enemies reveal when in detection range
[ ] Toggle "Reveal Fog" → all enemies visible
```

---

## Detection Ranges Reference

| Ship Type | Detection Range | Notes |
|-----------|-----------------|-------|
| Scout | 3 | Extended Sensors ability |
| Frigate | 2 | Fire Control Network |
| Destroyer | 1 | Basic sensors |
| Carrier | 2 | Standard capital |
| Interceptor | 1 | Basic sensors |
| Gunship | 1 | Basic sensors |
| Bomber | 1 | Basic sensors |

---

## Creating Custom Test Scenarios

1. In Fleet Setup, configure grid size and ships
2. Position ships for the scenario you want to test
3. Enable **Creative Mode**
4. Click **Save** to create a preset
5. Name it descriptively (e.g., "Dogfight - 2v2 Close Quarters")
6. Preset appears in your User Presets list

---

## Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| **Tab** | Switch team control | During COMMIT phase |
| **Home** | Recenter grid | Anytime |

---

## Future Enhancements

- [ ] Instant ship teleportation (debug)
- [ ] Damage/heal ships manually
- [ ] Spawn ships mid-battle
- [ ] Time controls (pause, step frame)
- [ ] Battle state save/load snapshots
