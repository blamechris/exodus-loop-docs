---
title: Crafting System
---

# Crafting System

The crafting system allows players to build new ship components using blueprints and resources collected during runs.

---

## Blueprint System

### Obtaining Blueprints

Blueprints drop from destroying capital ships:

| Source | Drop Chance | Max Drops |
|--------|-------------|-----------|
| Enemy Carrier | 15% | 1 per battle |
| Elite Carrier | 20% | 1 per battle |
| Boss Carrier | 25% + guaranteed | 1 per battle |

Dropped blueprints are randomly selected from the unowned pool in the Blueprint Registry.

### Blueprint Registry

All available blueprints are stored in the registry:

```gdscript
class BlueprintRegistry:
    var all_blueprints: Dictionary  # {id: BlueprintData}
    var owned_blueprints: Array[String]  # Unlocked IDs

    func get_unowned() -> Array[BlueprintData]
    func unlock(blueprint_id: String) -> void
```

### Blueprint Data

```gdscript
class BlueprintData:
    var id: String
    var component_type: ComponentType
    var shape: ShapeType
    var base_stats: Dictionary
    var material_cost: Dictionary  # {Metal: X, Energy: Y}
    var build_time: int  # Battles to complete
    var rarity_tier: Rarity
```

---

## Build Queue

### Queue Management

- **Max Concurrent Builds:** 3
- **Build Time:** Measured in battles completed
- **Progress:** Each battle advances all builds by 1

```gdscript
class BuildQueueManager:
    var queue: Array[BuildQueueEntry]  # Max 3

    func start_build(blueprint: BlueprintData) -> bool
    func advance_queue() -> Array[CompletedBuild]
    func cancel_build(entry_id: String) -> Dictionary  # Returns refund
```

### Build Queue Entry

```gdscript
class BuildQueueEntry:
    var id: String
    var blueprint_id: String
    var progress: int  # Battles completed
    var required: int  # Total battles needed
    var pre_rolled_traits: Array[String]
    var started_at: int  # Unix timestamp
```

### Trait Pre-Rolling

When a build starts, traits are pre-rolled based on rarity:

| Rarity | Trait Slots | Roll Pool |
|--------|-------------|-----------|
| COMMON | 0 | None |
| UNCOMMON | 1 | Minor traits |
| RARE | 1 | Major traits |
| EPIC | 2 | 1 minor + 1 major |
| LEGENDARY | 2 | 2 major + unique chance |

Traits are revealed when the build completes.

---

## Resource Costs

### By Component Type

| Type | Metal | Energy | Build Time |
|------|-------|--------|------------|
| ARMOR | 2 | 0 | 1 battle |
| ENGINE | 2 | 2 | 2 battles |
| REACTOR | 3 | 1 | 2 battles |
| HANGAR | 2 | 2 | 2 battles |
| WEAPON_BAY | 3 | 2 | 3 battles |
| SENSOR_ARRAY | 1 | 3 | 2 battles |
| BRIDGE | 2 | 2 | 2 battles |
| CREW_QUARTERS | 1 | 1 | 1 battle |
| ENGINEERING | 2 | 1 | 2 battles |

### Rarity Multiplier

Higher rarity blueprints cost more:

| Rarity | Cost Multiplier |
|--------|-----------------|
| COMMON | 1.0x |
| UNCOMMON | 1.5x |
| RARE | 2.0x |
| EPIC | 3.0x |
| LEGENDARY | 5.0x |

---

## Cancellation & Refunds

Canceling a build returns 50% of materials:

```gdscript
func cancel_build(entry_id: String) -> Dictionary:
    var entry = _get_entry(entry_id)
    var refund = {
        "Metal": floor(entry.metal_cost * 0.5),
        "Energy": floor(entry.energy_cost * 0.5)
    }
    queue.erase(entry)
    return refund
```

**Note:** Build progress is lost entirely. No partial completion bonus.

---

## Completed Builds

When a build completes:

1. Component added to inventory (not Exodus Fleet)
2. Pre-rolled traits are assigned
3. Player notified via completion modal
4. Component available for ship builder

### Completion Flow

```gdscript
func _on_battle_completed() -> void:
    var completed = build_queue.advance_queue()
    for build in completed:
        var component = _create_component(build)
        inventory.add(component)
        _show_completion_modal(component)
```

---

## UI Integration

### Build Queue Panel

Shown in Fleet Management screen:

```
┌─────────────────── BUILD QUEUE ───────────────────┐
│ [1] ENGINE (Rare)        [███████░░░] 7/10       │
│ [2] WEAPON_BAY (Common)  [██████████] COMPLETE!  │
│ [3] Empty slot           [+ Add Build]           │
└───────────────────────────────────────────────────┘
```

### Blueprint Selection

When starting a build:
- Shows all owned blueprints
- Displays resource cost
- Shows estimated completion (battles)
- Preview trait roll chances

---

## Integration Points

### BlueprintDropCalculator

```gdscript
# In blueprint_drop_calculator.gd
func calculate_drop(carrier: EnemyCarrier) -> BlueprintData:
    var chance = BASE_DROP_CHANCE  # 15%
    if carrier.is_elite:
        chance += 0.05
    if carrier.is_boss:
        chance += 0.10

    if randf() < chance:
        return _get_random_unowned_blueprint()
    return null
```

### SaveManager

```gdscript
# Save version 14+
func _serialize_build_queue() -> Array
func _deserialize_build_queue(data: Array) -> void
func _serialize_blueprints() -> Dictionary
func _deserialize_blueprints(data: Dictionary) -> void
```

### GameState

```gdscript
# After each battle
func _on_battle_ended(victory: bool) -> void:
    if victory:
        _check_blueprint_drop()
        _advance_build_queue()
```

---

## Design Goals

1. **Steady Progression** - Regular blueprint drops keep players engaged
2. **Meaningful Choices** - Limited queue slots force prioritization
3. **Battle Incentive** - Build progress encourages fighting vs. avoiding
4. **Risk-Free Crafting** - Crafted items go to inventory, not equipped (safe)
5. **Complementary to Extraction** - Craft what you can't extract
