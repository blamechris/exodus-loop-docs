---
title: Reinforcement System
---

# Reinforcement System

The ReinforcementManager controls multi-wave encounters, spawning additional enemies during battles based on various triggers.

---

## Wave Triggers

Reinforcements spawn based on these trigger types:

| Trigger | Condition |
|---------|-----------|
| **TURN_THRESHOLD** | After X turns have passed |
| **ENEMY_CASUALTIES** | When enemy losses exceed threshold |
| **PLAYER_ADVANTAGE** | When player is winning decisively |
| **CARRIER_DAMAGE** | When enemy carrier takes damage |
| **DISTRESS_BEACON** | Enemy unit with beacon trait calls for help |
| **SCRIPTED** | Boss phase transitions |

---

## Encounter-Specific Waves

### Quick Encounters

| Waves | Timing | Config |
|-------|--------|--------|
| 0 | N/A | No reinforcements |

Short battles with no additional spawns.

### Standard Encounters

| Waves | Timing | Config |
|-------|--------|--------|
| 0-1 | Turn 4-6 | 2 fighters |

Basic encounters may spawn one small wave mid-battle.

### Ambush Encounters

| Waves | Timing | Config |
|-------|--------|--------|
| 1-2 | Turns 3-5, 7-9 | 3 fighters per wave |

Ambushes feature aggressive enemies with multiple waves.

**Traits:** Aggressive behavior, flanking spawns

### Elite Encounters

| Waves | Timing | Config |
|-------|--------|--------|
| 1 | Turn 4-5 OR 50% losses | 4 fighters |

Elites reinforce based on casualties or time.

**Traits:** Hunter trait (focuses player carrier)

### Boss Encounters

| Waves | Timing | Config |
|-------|--------|--------|
| 2-3 | Turn 6 OR distress beacon | 4 fighters per wave |

Boss battles have the most reinforcements.

**Traits:** First unit carries distress beacon, triggering additional waves when destroyed.

### Fleet Encounters

| Waves | Timing | Config |
|-------|--------|--------|
| 1-2 | Turns 5-7, 10-12 | Varies |

Large-scale battles with side spawns.

**Spawn Position:** Flanks (left/right edges)

### Pursuit Encounters

| Waves | Timing | Config |
|-------|--------|--------|
| 1-2 | Turns 3-4, 6-7 | Varies |

Enemies chasing the player fleet.

**Spawn Position:** Behind player (top of grid)

### Mining Encounters

| Waves | Timing | Config |
|-------|--------|--------|
| 0-1 | Turn 6-8 | May include Miner ships |

Resource-focused encounters with potential defender spawns.

### Derelict Encounters

| Waves | Timing | Config |
|-------|--------|--------|
| 0 | Detection-triggered | Special wave, 1 turn warning |

Exploration encounters that can trigger hostile spawns when investigating.

---

## Wave Configuration

Each wave is configured with:

```gdscript
class WaveConfig:
    var trigger: WaveTrigger
    var trigger_value: int  # Turn number or casualty %
    var fighter_count: int
    var spawn_position: SpawnPosition  # CENTER, FLANKS, BEHIND
    var trait_weights: Dictionary  # {trait: weight}
```

### Spawn Positions

| Position | Grid Location |
|----------|---------------|
| CENTER | Top center of grid |
| FLANKS | Left and right edges |
| BEHIND | Behind player (bottom for enemy, top for player) |

### Carrier Trait Weights

Each encounter type has weighted traits for spawned carriers:

```gdscript
# Ambush encounters
var AMBUSH_CARRIER_TRAITS = {
    "AGGRESSIVE": 0.6,
    "HUNTER": 0.3,
    "SUICIDAL": 0.1
}

# Boss encounters
var BOSS_CARRIER_TRAITS = {
    "DEFENSIVE": 0.4,
    "AGGRESSIVE": 0.3,
    "HUNTER": 0.2,
    "CAUTIOUS": 0.1
}
```

---

## Wave Announcement UI

When reinforcements spawn, a `WaveAnnouncement` component displays:

1. Warning flash (1 turn before)
2. "REINFORCEMENTS INCOMING" banner
3. Enemy count and spawn direction
4. Wave number (e.g., "Wave 2 of 3")

---

## Integration Points

### Battle Screen

```gdscript
# In battle_screen.gd
var reinforcement_manager: ReinforcementManager

func _on_turn_ended(turn: int) -> void:
    var spawns = reinforcement_manager.check_triggers(turn)
    for spawn in spawns:
        _spawn_enemy_wave(spawn)
```

### Enemy Carrier

```gdscript
# In enemy_carrier.gd
func _on_fighter_destroyed(fighter: Enemy) -> void:
    if fighter.has_trait("DISTRESS_BEACON"):
        reinforcement_manager.trigger_beacon()
```

### GameState

```gdscript
# Encounter setup
func setup_encounter(encounter_type: String) -> void:
    reinforcement_manager.configure_for_encounter(encounter_type)
```

---

## Balance Considerations

- Early waves are smaller (1-2 fighters)
- Later waves scale with encounter difficulty
- Boss encounters always have distress beacon trigger
- Total reinforcement count capped per encounter type
- Spawn position rotates to prevent predictable camping
