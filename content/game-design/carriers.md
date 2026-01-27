---
title: Carrier Types
---

# Carrier Types

The carrier is your mobile base and flagship. You select your carrier class at the start of each run, which determines your starting components and bonuses.

## Carrier Classes (4)

Each carrier class provides a different starting configuration in the Ship Builder V2 polyomino system.

| Class | Name | Speed | Detection | Defense | Attack | Hangar | Specialty |
|-------|------|-------|-----------|---------|--------|--------|-----------|
| SCOUT | Scout Carrier | +1 | +2 | — | — | Small | Sensors, speed |
| STANDARD | Standard Carrier | — | — | — | — | Medium | Balanced |
| BATTLE | Battlecarrier | — | — | +2 | +1 | Medium | Armor, weapons |
| TENDER | Fleet Tender | — | — | — | — | +2 | Large hangars |

### Scout Carrier
**Fast and agile with extended sensors.**
- Guaranteed pieces: Hull Core, Reactor, Engine (large), Sensor Array, Hangar (small), Bridge
- Bonus draw pool: 60% Sensors, 40% Engines, 20% Armor
- Best for: Hit-and-run tactics, early detection, reconnaissance

### Standard Carrier
**Balanced performance for all situations.**
- Guaranteed pieces: Hull Core, Reactor, Engine, Hangar ×2, Bridge, Armor
- Bonus draw pool: Even mix of Hangars, Armor, Engines, Weapons
- Best for: Learning the game, adaptable strategies

### Battlecarrier
**Heavy armor and firepower at the cost of mobility.**
- Guaranteed pieces: Hull Core, Large Reactor, Engine (small), Weapon Bays ×2, Heavy Armor ×2, Hangar, Bridge
- Bonus draw pool: 50% Armor, 33% Weapons, 17% Reactors
- Best for: Defensive playstyles, holding positions, tanking damage

### Fleet Tender
**Large hangar capacity for maximum squadron deployment.**
- Guaranteed pieces: Hull Core, Reactors ×2, Engine, Large Hangars ×3, Bridge, Crew Quarters
- Bonus draw pool: 50% Hangars, 33% Crew Quarters, 17% Engineering
- Best for: Squadron-focused strategies, swarm tactics

---

## Ship Builder V2 (Polyomino System)

Carriers are built using a **tetris-style polyomino system**. Each component is a shaped piece that must fit on the carrier's grid.

### Component Types

| Type | Icon | Function | Power |
|------|------|----------|-------|
| HULL_CORE | [C] | Mandatory center, destruction = explosion | — |
| ARMOR | [#] | Absorbs damage, protects other components | 0 |
| REACTOR | [R] | Generates power for other systems | +power |
| ENGINE | [E] | Provides movement speed | -power |
| HANGAR | [H] | Stores and launches squadrons | -power |
| WEAPON_BAY | [W] | Offensive weapons | -power |
| SENSOR_ARRAY | [S] | Detection and targeting | -power |
| BRIDGE | [B] | Command and control | -power |
| CREW_QUARTERS | [Q] | Crew capacity | -power |
| ENGINEERING | [G] | Repair and maintenance | -power |

### Polyomino Shapes

Components come in various shapes:
- **Single** (1 cell)
- **Domino** (2 cells: horizontal or vertical)
- **Tromino** (3 cells: I, L shapes)
- **Tetromino** (4 cells: O, I, T, L, S shapes)

Larger shapes provide more stats per piece but are harder to fit.

### Sectors

The carrier grid is divided into 5 sectors for directional damage:

```
        FRONT
    +----------+
    |    F     |
 L  | L  C  R  |  R
 E  |    O     |  I
 F  |    R     |  G
 T  |    E     |  H
    |          |  T
    +----------+
        REAR
```

- **CENTER**: Hull Core (mandatory 2×2)
- **FRONT**: Sensors, forward weapons
- **REAR**: Engines, reactors
- **LEFT/RIGHT**: Hangars, side weapons

---

## Directional Damage System

Damage comes from a direction based on attacker position relative to defender heading.

### Damage Flow
1. Incoming damage hits the sector facing the attacker
2. Outer components in that sector take damage first
3. Damage progresses inward toward Hull Core

### Sector Damage States

| Condition | Effect |
|-----------|--------|
| 50% sector cells damaged | **SECTOR CRITICAL** - systems in that sector disabled |
| 50%+ total tiles damaged | **CRITICALLY DAMAGED** - can't move/act |
| Hull Core destroyed OR 75%+ destroyed | **EXPLOSION** - carrier destroyed |

### Disabled Sector Effects

| Sector | Systems Lost |
|--------|--------------|
| FRONT | Sensors, forward weapons |
| REAR | Engines (can't move), reactors offline |
| LEFT | Left hangar bays, left weapons |
| RIGHT | Right hangar bays, right weapons |
| CENTER | EXPLOSION (core is center) |

---

## Capital Ship Collisions

When two capital ships attempt to occupy the same cell:

1. **Both take collision damage**: 2 + size difference
2. **Smaller ship takes +1 extra damage**
3. **Both pushed back 1 tile** in opposite directions
4. **Edge collision**: +2 damage instead of pushback

---

## Enemy Carriers

Enemy carriers use the same polyomino system but with procedurally generated loadouts.

**Base Stats:** ATK 1, DEF 2, SPD 1, Hull 10, Hangar 4

**Behavior Traits:**
| Trait | Effect |
|-------|--------|
| AGGRESSIVE | -50% retreat chance, +20% attack priority |
| DEFENSIVE | +30% hold-near-carrier behavior |
| HUNTER | Focuses exclusively on player carrier |
| CAUTIOUS | +40% retreat chance |
| STATIC | 80% hold position, 20% advance |
| SUICIDAL | 0% retreat, +1 ATK |

### Nautolan Leviathan
A special enemy carrier variant for the Nautolan alien faction with bio-organic components and swarm tactics.
