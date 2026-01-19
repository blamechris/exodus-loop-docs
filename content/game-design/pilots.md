---
title: Pilot System
---

# Pilot System

Pilots are named characters that can be assigned to squadrons, providing stat bonuses, perks, and persistent progression across runs.

## Pilot Stats

| Stat | Description |
|------|-------------|
| name | Callsign (from pool of 20) |
| perks | Array of PerkType (1-3 slots based on level) |
| xp | Experience points |
| level | Current level (1-5) |
| morale | 0-100 scale |
| passive_ability | Unlocked at level 4+ |
| kills | Enemy squadrons destroyed |
| missions | Missions survived |
| is_alive | Permadeath state |
| is_carried_over | Veteran roster persistence |

---

## Pilot Perks

Pilots gain perk slots as they level: 1 slot at L1, 2 at L2, 3 at L3+.

| Perk | Stat Bonus | Description |
|------|------------|-------------|
| STEADY_AIM | +1 ATK | Patient targeting yields consistent hits |
| EVASIVE | +1 DEF | Always watching the blind spots |
| QUICK_REFLEXES | +1 SPD | First to react, last to fall |
| IRON_WILL | +1 Hull | Refuses to eject until mission complete |
| FUEL_EFFICIENT | +1 Fuel | Coasts on fumes when others would crash |

Perks stack with multiple slots. A level 3 pilot could have:
- STEADY_AIM (+1 ATK)
- EVASIVE (+1 DEF)
- QUICK_REFLEXES (+1 SPD)

No duplicate perks allowed on the same pilot.

---

## Level Progression

| Level | XP Required | Rank Name | Perk Slots |
|-------|-------------|-----------|------------|
| 1 | 0 | Rookie | 1 |
| 2 | 50 | Veteran | 2 |
| 3 | 150 | Ace | 3 |
| 4 | 300 | Elite | 3 |
| 5 | 500 | Legend | 3 |

### XP Awards

| Event | XP Gained |
|-------|-----------|
| Mission survival | 25 (50 for boss) |
| Enemy kill | 10 |
| Run completion bonus | 25 |

---

## Morale System

Morale ranges from 0-100 and affects combat performance.

### Morale Thresholds

| Morale | ATK Modifier | DEF Modifier |
|--------|--------------|--------------|
| High (≥80) | +1 | 0 |
| Normal (21-79) | 0 | 0 |
| Low (≤20) | -1 | -1 |

### Morale Changes

| Event | Change |
|-------|--------|
| Victory (mission survived) | +10 |
| Enemy kill | +5 |
| Damage taken | -5 per HP lost |
| Ally squadron destroyed | -15 (all pilots) |
| Escort destroyed | -10 |

---

## Passive Abilities

Automatically unlocked when pilot reaches Level 4+. Based on primary perk (first in array).

| Primary Perk | Ability | Effect |
|--------------|---------|--------|
| STEADY_AIM | Critical Eye | 20% chance for +2 damage on hit |
| EVASIVE | Afterburner | Once per battle, ignore one attack |
| QUICK_REFLEXES | First Strike | +2 initiative on turn 1 |
| IRON_WILL | Last Stand | +2 DEF when below 50% hull |
| FUEL_EFFICIENT | Extended Range | +1 movement range |

---

## Permadeath

When a pilot's squadron is destroyed:

1. **Check Eject Protocol** (Admiral skill, if unlocked)
   - 20% survival chance
   - If successful: pilot unassigned but alive
   - If failed: proceed to step 2

2. **Permadeath**
   - `is_alive` set to false
   - Removed from `pilot_roster`
   - Added to `deceased_pilots`
   - Visible in Hall of Fame

Dead pilots do NOT carry over between runs.

---

## Veteran Roster (Cross-Run Persistence)

Requires meta-upgrade unlocks:

| Upgrade | Cost | Effect |
|---------|------|--------|
| veteran_roster_1 | 100 XP | 1 pilot carries over |
| veteran_roster_2 | 150 XP | 2 pilots carry over |
| veteran_roster_3 | 150 XP | 3 pilots carry over |

Carried-over pilots:
- Retain level, XP, perks, passive ability
- Reset morale to 100
- Clear kills/missions for new run

---

## Callsign Pool

20 available callsigns:

```
Maverick, Iceman, Goose, Viper, Jester,
Phoenix, Rooster, Hangman, Ace, Ghost,
Reaper, Hawk, Shadow, Storm, Thunder,
Lightning, Blaze, Frost, Nova, Comet
```

---

## Admiral Eject Protocol

The Admiral's "Eject Protocol" skill provides pilot survival chance:

- **Tier:** 2 (requires 1 tier 1 skill)
- **Value:** 0.20 (20% chance)
- **Effect:** When squadron destroyed, 20% chance pilot survives

This is the primary defense against permadeath and makes leveling the Admiral crucial for pilot retention.
