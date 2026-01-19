---
title: Balance Constants
---

# Balance Constants

This page documents all magic numbers extracted from the codebase, providing a single reference for balance tuning.

## Squadron Base Stats

| Type | SPD | ATK | DEF | Hull | Ammo | Fuel | Move | Detection |
|------|-----|-----|-----|------|------|------|------|-----------|
| Interceptor | 3 | 1 | 1 | 3 | 3 | 4 | 2 | 1 |
| Bomber | 1 | 3 | 1 | 4 | 2 | 2 | 1 | 1 |
| Gunship | 2 | 2 | 3 | 5 | 3 | 3 | 1 | 1 |
| Frigate | 2 | 1 | 2 | 4 | 5 | 4 | 1 | 2 |
| Destroyer | 2 | 3 | 1 | 5 | 3 | 3 | 1 | 1 |
| Scout | 4 | 1 | 1 | 2 | 2 | 5 | 2 | 3 |
| Miner | 1 | 0 | 1 | 3 | 0 | 4 | 1 | 1 |

**File:** `src/entities/squadron.gd` lines 15-51

---

## Resource Costs

| Squadron | Metal | Energy |
|----------|-------|--------|
| Interceptor | 2 | 0 |
| Bomber | 0 | 2 |
| Gunship | 1 | 1 |
| Frigate | 2 | 1 |
| Destroyer | 2 | 1 |
| Scout | 1 | 1 |
| Miner | TBD | TBD |

---

## Starting Resources

| Resource | Base | With Upgrades |
|----------|------|---------------|
| Metal | 10 | 13 (supply_cache_1) |
| Energy | 10 | 13 (supply_cache_1) |
| Fuel | 3 | 4 (fuel_reserves_1) |
| Hangar | 3 | 5 (expanded_hangar_1) |

**File:** `src/autoload/game_state.gd` lines 366-394

---

## Carrier Stats

| Stat | Base Value | With Upgrades |
|------|------------|---------------|
| HP | 10 | 20 (reinforced_hull_1 + _2) |
| Detection Range | 2 | 3 (long_range_sensors) |
| Point Defense | HP ≤ 2 | HP ≤ 4 (point_defense_plus_1) |
| Shield Burst | — | 3 damage (shield_burst_1) |

---

## Combat Constants

### Damage Formula
```
Damage = max(0, DiceRoll + ATK - DEF)
```

### Dice Types
| Type | Range | Average |
|------|-------|---------|
| d4 (disadvantage) | 1-4 | 2.5 |
| d6 (neutral) | 1-6 | 3.5 |
| d10 (advantage) | 1-10 | 5.5 |

### Initiative Formula
```
Initiative = 1d[SPD+1]
```

| SPD | Die Size | Range | Average |
|-----|----------|-------|---------|
| 1 | d2 | 1-2 | 1.5 |
| 2 | d3 | 1-3 | 2.0 |
| 3 | d4 | 1-4 | 2.5 |
| 4 | d5 | 1-5 | 3.0 |

**File:** `src/autoload/dice_system.gd` lines 52-112

---

## Action Modifiers

| Action | ATK | DEF |
|--------|-----|-----|
| ATTACK | +1 | 0 |
| DEFEND | +1 | +2 |
| MOVE | 0 | 0 |
| LAND | 0 | 0 |

**File:** `src/entities/squadron.gd` lines 438-546

---

## Morale Thresholds

| Range | ATK Mod | DEF Mod |
|-------|---------|---------|
| High (≥80) | +1 | 0 |
| Normal (21-79) | 0 | 0 |
| Low (≤20) | -1 | -1 |

### Morale Changes

| Event | Change |
|-------|--------|
| Victory | +10 |
| Kill | +5 |
| Damage taken | -5 per HP |
| Ally destroyed | -15 |
| Escort destroyed | -10 |

**File:** `src/autoload/game_state.gd` lines 1928-2003

---

## Pilot XP Thresholds

| Level | XP Required | Cumulative |
|-------|-------------|------------|
| 1 | 0 | 0 |
| 2 | 50 | 50 |
| 3 | 150 | 150 |
| 4 | 300 | 300 |
| 5 | 500 | 500 |

### XP Awards

| Event | XP |
|-------|-----|
| Mission survival | 25 |
| Boss mission | 50 |
| Enemy kill | 10 |
| Run completion | 25 |

**File:** `src/entities/pilot.gd`

---

## Admiral XP Thresholds

| Level | XP for Next | Cumulative |
|-------|-------------|------------|
| 0→1 | 100 | 100 |
| 1→2 | 250 | 350 |
| 2→3 | 450 | 800 |
| 3→4 | 700 | 1500 |
| 4→5 | 1000 | 2500 |
| 5→6 | 1500 | 4000 |

**File:** `src/entities/admiral.gd`

---

## Meta-Upgrade Costs

### By Tier

| Tier | Cost Range | Count |
|------|------------|-------|
| 1 | 50 XP | 5 |
| 2 | 75-100 XP | 10 |
| 3 | 100-150 XP | 4 |
| 4 | 150-200 XP | 3 |

### Total XP to Unlock All
- Minimum path: ~1500 XP
- All upgrades: ~2000 XP

**File:** `src/autoload/game_state.gd` lines 94-254

---

## Battle Generation

### Default Grid Size
- Width: 7 cells
- Height: 8 cells
- Minimum safe: 6×7 (WARNING: smaller maps break spawn zone calculations)

### Spawn Zones
- Player: Bottom 2 rows
- Enemy: Top 2 rows
- Carrier: Center-bottom

**File:** `src/autoload/battle_map_generator.gd` lines 150-196

---

## Admiral Skill Values

| Skill | Stat | Value |
|-------|------|-------|
| LAST_STAND | atk_bonus_low_hp | +1 |
| EMERGENCY_REPAIRS | carrier_heal_end | +1 HP |
| EJECT_PROTOCOL | pilot_survival_chance | 0.20 |
| RALLY_CRY | first_squadron_ap | +1 AP |
| IRON_WILL | carrier_first_hit_reduction | -1 dmg |
| DESPERATE_MEASURES | atk_bonus_carrier_critical | +2 |

**File:** `src/entities/admiral.gd` lines 13-86

---

## Known Balance Issues

See [[internal/tech-debt|Tech Debt]] for:
- Pilot survival chance can exceed 1.0 (unclamped)
- Minimum map size unvalidated
- Various magic number locations needing constants

---

*All values extracted from codebase v0.5.23*
