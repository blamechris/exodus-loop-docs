---
title: Fleet Management System
---

# Fleet Management System

Squadron location and state management for dock/undock operations between carriers and escort duty.

---

## Overview

Ships in your fleet can be in different **locations** relative to the carrier:

| Location | Description | Combat Status |
|----------|-------------|---------------|
| **DOCKED** | In carrier hangar | Safe, must launch to fight |
| **ESCORTING** | Flying alongside carrier | On grid, consumes fuel per jump |

---

## Location vs State

**Important Distinction:**

- **Location** (ShipLocation enum): Where the ship physically is - DOCKED or ESCORTING
- **State** (Squadron.State enum): Operational status - READY, MOVING, ATTACKING, etc.

A ship's location determines whether it appears on the battle grid, while state tracks its in-combat actions.

---

## Docking & Undocking

### Dock (Escorting → Docked)

Move a ship from escort duty into the carrier hangar:

**Requirements:**
- Ship must be in ESCORTING location
- Carrier hangar has available capacity
- Must have fleet actions remaining

**Effects:**
- Ship enters hangar (safe from grid combat)
- No longer consumes fuel on jumps
- Can be launched during positioning/battle

### Undock (Docked → Escorting)

Deploy a ship from hangar to escort duty:

**Requirements:**
- Ship must be in DOCKED location
- Must have fleet actions remaining

**Effects:**
- Ship joins escort fleet
- Appears on battle grid
- Consumes fuel on node jumps (+1 fuel per escort)

---

## Fleet Actions

Fleet management uses an **action economy** system:

| Node Type | Actions Available |
|-----------|-------------------|
| Combat nodes | 1 action |
| Safe nodes (Rest, Shop) | Unlimited |

**Actions that consume fleet actions:**
- Dock a ship
- Undock a ship
- Repair a ship (in Fleet Management screen)
- Build a ship

---

## Escort Fuel Cost

Escorts consume additional fuel on each node transition:

```
Total Fuel Cost = Base Cost + (Escort Count × 1)
```

| Escort Count | Added Cost |
|--------------|------------|
| 0 | +0 |
| 1 | +1 |
| 2 | +2 |
| 3+ | +3+ |

This creates strategic trade-offs:
- More escorts = more firepower but higher fuel cost
- Dock ships to conserve fuel on long journeys
- Undock before challenging encounters

---

## Fleet Management Screen

Access via the FLEET button on the node map or after battle victories.

### Tabs

| Tab | Purpose |
|-----|---------|
| **Build** | Create new squadrons (costs Metal/Energy) |
| **Repair** | Fix damaged ships (1 Metal per HP) |
| **Pilots** | Assign/swap pilots between ships |
| **Stats** | Fleet overview and totals |

### UI Elements

**Ship Cards:** Display each ship with:
- Name and callsign
- HP bar (current/max)
- Pilot assignment
- Location badge (DOCKED/ESCORTING)
- Dock/Undock button

**Dock Button:**
- Visible for ESCORTING ships
- Disabled if no fleet actions remain
- Disabled if hangar is full

**Undock Button:**
- Visible for DOCKED ships
- Disabled if no fleet actions remain

---

## Implementation

### GameState Methods

```gdscript
# Check if dock/undock is possible
func can_dock_squadron(squad: Squadron) -> bool
func can_undock_squadron(squad: Squadron) -> bool

# Execute dock/undock
func dock_squadron(squad: Squadron) -> bool
func undock_squadron(squad: Squadron) -> bool

# Fleet action economy
func can_perform_fleet_action() -> bool
func consume_fleet_action() -> void
```

### Squadron Fields

```gdscript
# Ship location enum
enum ShipLocation { DOCKED, ESCORTING }

# Current location
var ship_location: ShipLocation = ShipLocation.DOCKED
```

### Save Version

**Squadron SAVE_VERSION: 7**
- Added `ship_location` field

**RUN_SAVE_VERSION: 9**
- Added `fleet_actions_remaining` to run state

---

## Escort Fuel Calculation

```gdscript
# In game_state.gd
func get_escort_count() -> int:
    var count := 0
    for squad in squadron_roster:
        if squad.ship_location == Squadron.ShipLocation.ESCORTING:
            count += 1
    return count

func calculate_jump_fuel_cost(base_cost: int = 1) -> int:
    return base_cost + get_escort_count()
```

---

## Battle Integration

### Positioning Phase

- ESCORTING ships start on grid (deployment zone)
- DOCKED ships remain in carrier hangar
- Ships with "Early Launch" trait can deploy from hangar

### Combat Phase

- Only ESCORTING ships participate in grid combat
- DOCKED ships are safe until launched
- Launched ships become ESCORTING for the battle duration

### Post-Battle

- Surviving ships retain their location state
- Destroyed ships are removed from roster
- Flee to Fleet Management screen for reorganization

---

## Design Rationale

The fleet ownership model provides:

1. **Tactical Depth** - Choose which ships to expose vs protect
2. **Resource Management** - Fuel cost trade-offs
3. **Strategic Planning** - Pre-position fleet for upcoming encounters
4. **Risk Mitigation** - Keep valuable ships docked during risky jumps

---

*Last Updated: 2026-01-28*
*Implementation Version: 0.5.30*
