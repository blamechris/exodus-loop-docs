---
title: Game Design Document v1.0
---

# Exodus Loop - Game Design Document v1.0

**Version:** 1.1 (reflects implementation as of v0.5.24)
**Last Updated:** 2026-01-19
**Engine:** Godot 4.5 (GDScript)
**Platforms:** iOS, Android

> This GDD documents the **actual implementation**, not the original design vision. For the original MVP scope document, see `docs/GDD_ORIGINAL.md` in the repository.

---

## High Concept

You are the captain of humanity's last carrier, escorting refugee fleet survivors fleeing a Borg-like assimilating enemy. When you die, you wake up at the beginning—Edge of Tomorrow style—retaining knowledge and eventually sharing your time-loop power with elite pilots.

**Core Fantasy:** Desperate tactical commander making impossible choices with limited resources.

---

## Core Loop

```
NODE MAP --> SETUP PHASE --> COMBAT --> REWARDS --> NODE MAP
                                                      |
On Death: XP awarded --> Meta upgrades --> New Run ---+
```

Each run progresses through a procedurally generated node map. Battles use turn-based tactical combat on a variable N×M grid (default 7×8). Between runs, XP purchases permanent upgrades.

---

## Implementation vs Original Design

| Aspect | Original MVP | Current Implementation |
|--------|--------------|----------------------|
| Squadron Types | 3 (RPS triangle) | **7** (3 RPS + 4 specialist) |
| Carrier Types | 1 (fixed) | **4** (Scout, Standard, Battle, Tender) |
| Meta Upgrades | 1-2 | **22** with prerequisites |
| Combat Resolution | Simultaneous | **Sequential** (initiative-based) |
| Grid Size | 5×7 fixed | **Variable N×M** (default 7×8) |
| Pilot System | Post-MVP | **Fully implemented** |
| Admiral Skills | Not planned | **6 skills** across 3 tiers |
| Blessed Squadrons | Post-MVP | **Implemented** |
| Sensor Tiers | Not planned | **5 tiers** (0-4) |
| Achievements | Not planned | **6 achievements** |
| Tutorial | Basic | **Guided demonstration** with 9 steps |

---

## Sections

1. [[squadrons|Squadron Types]] - All 7 types with stats and abilities
2. [[carriers|Carrier Types]] - 4 player carrier types and enemy carriers
3. [[combat|Combat System]] - Preparation phase, sequential resolution, damage formulas
4. [[pilots|Pilot System]] - Perks, morale, permadeath, blessed mechanics
5. [[progression|Progression]] - 22 upgrades, Admiral skill tree
6. [[achievements|Achievements]] - 6 unlockable achievements
7. [[balance|Balance Constants]] - Extracted magic numbers

---

## References & Inspiration

- **FTL** - Crew management, desperation, node map
- **Monster Train** - Wave defense, unit placement
- **Into the Breach** - Turn-based tactics, information clarity
- **Battlestar Galactica** - Tone, fleet survival, carrier operations
- **Edge of Tomorrow** - Time loop narrative justification
